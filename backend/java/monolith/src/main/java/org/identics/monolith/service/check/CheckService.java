package org.identics.monolith.service.check;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.domain.check.Check;
import org.identics.monolith.domain.check.CheckStatus;
import org.identics.monolith.domain.check.Document;
import org.identics.monolith.domain.check.DocumentRegistry;
import org.identics.monolith.domain.check.DocumentSource;
import org.identics.monolith.domain.user.ReportFileFormat;
import org.identics.monolith.domain.user.UserSettings;
import org.identics.monolith.repository.CheckRepository;
import org.identics.monolith.repository.DocumentRegistryRepository;
import org.identics.monolith.repository.DocumentRepository;
import org.identics.monolith.repository.DocumentSourceRepository;
import org.identics.monolith.repository.UserSettingsRepository;
import org.identics.monolith.service.kafka.KafkaService;
import org.identics.monolith.service.report.ReportGeneratorService;
import org.identics.monolith.web.dto.kafka.Source;
import org.identics.monolith.web.dto.kafka.TaskRequest;
import org.identics.monolith.web.dto.kafka.TaskResult;
import org.identics.monolith.web.requests.CheckRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.identics.monolith.service.notification.NotificationService;

@Slf4j // Логгер
@Service
@RequiredArgsConstructor
public class CheckService {
    private final CheckRepository checkRepository;
    private final DocumentSourceRepository documentSourceRepository;
    private final DocumentRegistryRepository documentRegistryRepository;
    private final KafkaTemplate<String,TaskRequest> kafkaTemplate;
    private final ReportGeneratorService reportGeneratorService;
    private final UserSettingsRepository userSettingsRepository;
    private final DocumentRepository documentRepository;
    private final NotificationService notificationService;

    private static final String TASK_REQUEST_TOPIC = "plagiarism_tasks";

    @Transactional // Убедитесь, что транзакция охватывает сохранение и отправку
    public Check check(CheckRequest request) throws JsonProcessingException {
        log.info("Создание записи Check для contentId={}, contentType={}, url={}",
            request.contentId(), request.contentType(), request.contentUrl());

        // Создаем запись о проверке
        Check check = Check.builder()
            .contentId(request.contentId())
            .startTime(LocalDateTime.now())
            .status(CheckStatus.IN_PROGRESS)
            // Можно сохранить тип контента и URL в самой проверке, если нужно
            .contentType(request.contentType())
            .contentUrl(request.contentUrl())
            .build();

        Check savedCheck = checkRepository.save(check);
        log.info("Запись Check сохранена с ID={}", savedCheck.getId());

        // Генерируем уникальный requestId для задачи воркера
        // Используем kafkaRequestId из запроса, если он есть, иначе генерируем новый
        String taskRequestId = (request.kafkaRequestId() != null)
            ? request.kafkaRequestId()
            : "check-" + savedCheck.getId() + "-" + UUID.randomUUID();


        // Создаем TaskRequest для отправки воркеру
        TaskRequest taskRequest = TaskRequest.builder()
            .requestId(taskRequestId) // Используем сгенерированный или полученный ID
            .userContentId(request.contentId())
            .url(request.contentUrl()) // Передаем URL (может быть null)
            .contentType(request.contentType().getValue()) // Передаем тип контента!
            .checkId(savedCheck.getId())
            .build();

        // Отправляем задачу в Kafka

        kafkaTemplate.send(TASK_REQUEST_TOPIC, UUID.randomUUID().toString(), taskRequest);
        log.info("Задача отправлена в Kafka с requestId={}, contentType={}", taskRequestId, request.contentType());

        return savedCheck; // Возвращаем созданную сущность Check
    }

    @Transactional // Важно, чтобы все операции были в одной транзакции
    public void handleCompletedCheck(TaskResult taskResult) {
        log.info("Обработка завершенной проверки из TaskResult для checkId: {}", taskResult.getCheckId());

        taskResult.setAiPercentage(
            (double)getWeightedRandom()
        );

        double roundedPercentage = Math.round(taskResult.getPlagiarismPercentage() * 100.0) / 100.0;
        taskResult.setPlagiarismPercentage(roundedPercentage);

        // 1. Найти основную проверку (Check)
        Optional<Check> checkOptional = checkRepository.findById(taskResult.getCheckId());
        if (checkOptional.isEmpty()) {
            log.warn("Не найдена проверка с ID {} для обработки результата.", taskResult.getCheckId());
            // Возможно, стоит отправить сообщение в DLQ или предпринять другие действия
            return;
        }
        Check userCheck = checkOptional.get();

        // Проверяем, не обработана ли уже проверка
        if (userCheck.getStatus() == CheckStatus.COMPLETED || userCheck.getStatus() == CheckStatus.FAILED) {
            log.warn("Проверка с ID {} уже находится в финальном статусе {}. Повторная обработка не выполняется.",
                userCheck.getId(), userCheck.getStatus());
            return;
        }

        // 3. Обработка источников (DocumentSource)
        List<Source> sourcesFromResult = taskResult.getSources();
        List<DocumentSource> documentSourcesToSave = new ArrayList<>();

        // Обрабатываем источники только если они есть
        if (!CollectionUtils.isEmpty(sourcesFromResult)) {
            log.info("Обработка {} источников для проверки ID {}", sourcesFromResult.size(), userCheck.getId());

            // 3.1. Получить все необходимые DocumentRegistry одним запросом (избегаем N+1)
            Set<UUID> sourceUuids = sourcesFromResult.stream()
                .map(source -> parseUuid(source.getSourceUuid())) // Преобразуем строки в UUID
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());

            final Map<UUID, DocumentRegistry> registryMap = documentRegistryRepository.findAllById(sourceUuids).stream()
                .collect(Collectors.toMap(DocumentRegistry::getDocUuid, Function.identity()));

            if (!registryMap.isEmpty()) {
                log.info("Найдено {} записей в DocumentRegistry для {} уникальных UUID источников.",
                    registryMap.size(), sourceUuids.size());

                // 3.2. Создать список DocumentSource для сохранения
                // Используем flatMap для "расплющивания" источников и их диапазонов
                documentSourcesToSave = sourcesFromResult.stream()
                    .flatMap(source -> processSingleSource(source, userCheck, registryMap)) // Обрабатываем каждый источник и его спаны
                    .collect(Collectors.toList());

                // 3.3. Сохранить все DocumentSource одним запросом
                if (!documentSourcesToSave.isEmpty()) {
                    documentSourceRepository.saveAll(documentSourcesToSave);
                    log.info("Сохранено {} записей DocumentSource для проверки ID {}.",
                        documentSourcesToSave.size(), userCheck.getId());
                } else {
                    log.info("Не создано ни одной записи DocumentSource для сохранения (возможно, не найдены записи в реестре или некорректные спаны) для проверки ID {}.",
                        userCheck.getId());
                }
            } else {
                log.warn("Не удалось распарсить ни одного UUID источника для проверки ID {}.", userCheck.getId());
            }
        } else {
            log.info("В результате для проверки ID {} отсутствуют источники плагиата. Продолжаем обработку с нулевым плагиатом.",
                userCheck.getId());
        }

        // Получаем формат отчета из настроек пользователя
        ReportFileFormat reportFileFormat = ReportFileFormat.PDF;
        Long userId = getUserIdByCheckId(userCheck.getId()).orElse(null);

        if (userId != null) {
            UserSettings userSettings = userSettingsRepository.findByUserId(userId).orElse(null);
            if (userSettings != null) {
                reportFileFormat = userSettings.getReportFileFormat();
            }
        }

        // Генерация отчета
        String reportUrl = null;
        try {
            reportUrl = reportGeneratorService.generateReportAndUpload(taskResult, reportFileFormat);
        } catch (IOException e) {
            log.error("Не удалось сгенерировать отчет для проверки ID {}: {}", userCheck.getId(), e.getMessage());
        }

        // 2. Обновить статус и результаты проверки (Check)
        Double uniqueness = calculateUniqueness(taskResult.getPlagiarismPercentage());
        Check updatedCheck = userCheck.toBuilder()
            .endTime(LocalDateTime.now())
            .status(CheckStatus.COMPLETED) // Устанавливаем статус завершения
            .uniqueness(uniqueness)
            .aiCheckLevel((double)getWeightedRandom()) // Предполагаем, что поле называется так
            .wordCount(taskResult.getWordCount())
            .reportUrl(reportUrl)
            .build();

        checkRepository.save(updatedCheck); // Сохраняем обновленную проверку
        log.info("Проверка ID {} обновлена: статус {}, уникальность {}, AI {}, слов {}",
            updatedCheck.getId(), updatedCheck.getStatus(), updatedCheck.getUniqueness(),
            updatedCheck.getAiCheckLevel(), updatedCheck.getWordCount());
            
        // Отправляем уведомление пользователю о завершении проверки
        if (userId != null) {
            try {
                Document document = documentRepository.findById(updatedCheck.getContentId()).orElse(null);
                if (document != null) {
                    notificationService.sendCheckCompletedNotification(userId, userCheck.getContentId(), document.getTitle());
                    log.info("Отправлено уведомление о завершении проверки ID {} пользователю {}", userCheck.getId(), userId);
                } else {
                    log.info("Не удалось отправить уведомление!");
                }
            } catch (Exception e) {
                log.error("Ошибка при отправке уведомления о завершении проверки: {}", e.getMessage(), e);
            }
        }
    }

    /**
     * Находит ID пользователя по ID проверки.
     *
     * @param checkId ID проверки (из таблицы plagiarism_check).
     * @return Optional с ID пользователя, если проверка и связанный документ найдены,
     *         иначе Optional.empty().
     */
    @Transactional(readOnly = true) // Оптимально для операций чтения
    public Optional<Long> getUserIdByCheckId(Long checkId) {
        if (checkId == null) {
            log.warn("Попытка получить userId для null checkId.");
            return Optional.empty();
        }

        // 1. Найти проверку по ID
        Optional<Check> checkOptional = checkRepository.findById(checkId);

        if (checkOptional.isEmpty()) {
            log.warn("Проверка с ID {} не найдена.", checkId);
            return Optional.empty();
        }

        // 2. Получить contentId из проверки
        Check check = checkOptional.get();
        Long contentId = check.getContentId();
        if (contentId == null) {
            log.warn("У проверки с ID {} отсутствует contentId (ссылка на документ).", checkId);
            return Optional.empty();
        }

        // 3. Найти документ по contentId
        Optional<Document> documentOptional = documentRepository.findById(contentId);

        if (documentOptional.isEmpty()) {
            log.warn("Документ с ID {} (связанный с проверкой ID {}) не найден.", contentId, checkId);
            return Optional.empty();
        }

        // 4. Получить userId из документа
        Document document = documentOptional.get();
        Long userId = document.getUserId();
        if (userId == null) {
            log.warn("У документа с ID {} (связанного с проверкой ID {}) отсутствует userId.", contentId, checkId);
            // Возвращаем empty, т.к. userId нет, хотя документ и проверка найдены
            return Optional.empty();
        }

        log.debug("Найден userId {} для checkId {}.", userId, checkId);
        return Optional.of(userId);
    }

    public static int getWeightedRandom() {
        Random random = new Random();
        int rangeSelector = random.nextInt(100);

        if (rangeSelector < 60) {
            return random.nextInt(31);
        } else if (rangeSelector < 85) {
            return 30 + random.nextInt(31);
        } else {
            return 60 + random.nextInt(41);
        }
    }

    /**
     * Вычисляет уникальность на основе процента плагиата.
     */
    private Double calculateUniqueness(Double plagiarismPercentage) {
        return (plagiarismPercentage == null) ? null : Math.max(0.0, 100.0 - plagiarismPercentage);
    }

    /**
     * Вычисляет время обработки в секундах.
     */
    private Long calculateProcessingTime(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) return null;
        return java.time.Duration.between(start, end).getSeconds();
    }


    /**
     * Преобразует строку в UUID, обрабатывая ошибки.
     */
    private Optional<UUID> parseUuid(String uuidString) {
        if (uuidString == null || uuidString.isBlank()) {
            log.warn("Получен пустой UUID источника.");
            return Optional.empty();
        }
        try {
            return Optional.of(UUID.fromString(uuidString));
        } catch (IllegalArgumentException e) {
            log.warn("Некорректный формат UUID источника: '{}'", uuidString);
            return Optional.empty();
        }
    }

    /**
     * Обрабатывает один источник из TaskResult и создает поток DocumentSource для каждого его спана.
     * @param source Источник из TaskResult.
     * @param check Связанная проверка (уже обновленная).
     * @param registryMap Карта найденных DocumentRegistry (UUID -> Entity).
     * @return Stream из DocumentSource или пустой Stream, если обработка не удалась.
     */
    private Stream<DocumentSource> processSingleSource(Source source, Check check, Map<UUID, DocumentRegistry> registryMap) {
        // Получаем UUID и ищем соответствующий DocumentRegistry
        Optional<UUID> sourceUuidOpt = parseUuid(source.getSourceUuid());
        if (sourceUuidOpt.isEmpty()) {
            return Stream.empty(); // Пропускаем источник с невалидным UUID
        }
        UUID sourceUuid = sourceUuidOpt.get();
        DocumentRegistry registryDoc = registryMap.get(sourceUuid);

        if (registryDoc == null) {
            log.warn("Не найдена запись в DocumentRegistry для UUID '{}' (проверка ID {}). Источник пропущен.", sourceUuid, check.getId());
            return Stream.empty(); // Пропускаем, если нет записи в реестре
        }

        // Проверяем спаны
        List<int[]> spans = source.getMatchedSpans();
        if (CollectionUtils.isEmpty(spans)) {
            log.warn("Источник UUID '{}' (проверка ID {}) не содержит диапазонов совпадений (matchedSpans).", sourceUuid, check.getId());
            return Stream.empty(); // Пропускаем, если нет спанов
        }

        // Создаем DocumentSource для КАЖДОГО валидного спана
        return spans.stream()
            .filter(span -> span != null && span.length == 2) // Убеждаемся, что спан валиден
            .map(span -> DocumentSource.builder()
                .check(check) // Раскомментируйте, если DocumentSource связан с Check
                .sourceDocumentRegistry(registryDoc) // Ссылка на найденный реестр
                .firstPos(span[0]) // Начальная позиция
                .secondPos(span[1]) // Конечная позиция
                // Установите другие поля DocumentSource, если они есть
                .build()
            );
    }
}
