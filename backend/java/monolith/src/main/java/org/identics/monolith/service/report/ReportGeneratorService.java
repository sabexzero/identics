package org.identics.monolith.service.report;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.domain.check.Check;
import org.identics.monolith.domain.report.ReportSettings;
import org.identics.monolith.domain.user.ReportFileFormat;
import org.identics.monolith.dto.ReportGenerationResult;
import org.identics.monolith.repository.CheckRepository;
import org.identics.monolith.repository.DocumentSourceRepository;
import org.identics.monolith.repository.ReportSettingsRepository;
import org.identics.monolith.service.s3.S3Service;
import org.identics.monolith.web.dto.kafka.TaskResult;
import org.identics.monolith.web.dto.report.ReportParameters;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;
import org.apache.commons.codec.digest.DigestUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportGeneratorService {
    private final TemplateEngine templateEngine;
    private final S3Service s3Service;
    private final PuppeteerService puppeteerService;
    private final ReportSettingsRepository reportSettingsRepository;
    private final CheckRepository checkRepository;
    private final DocumentSourceRepository documentSourceRepository;

    // --- Constants ---
    private static final String REPORT_FILENAME_PREFIX = "Textsource-report-";
    private static final String REPORT_S3_FOLDER = "reports/";

    /**
     * Генерация отчета с дополнительными параметрами и загрузкой в S3
     */
    public ReportGenerationResult generateReportAndUpload(TaskResult taskResult, ReportParameters parameters) throws IOException {
        if (taskResult == null || parameters == null || parameters.getFormat() == null) {
            throw new IllegalArgumentException("TaskResult и параметры не могут быть null");
        }

        ReportFileFormat fileFormat = parameters.getFormat();
        log.info("Запрос на генерацию и загрузку отчета для checkId: {}, формат: {}", taskResult.getCheckId(), fileFormat);

        byte[] reportBytes;
        String s3Key = generateS3Key(fileFormat);
        String contentType = fileFormat.getContentType();
        ReportFileFormat actualFileFormat = fileFormat;

        try {
            switch (fileFormat) {
                case HTML:
                    String htmlContent = generateHtmlReport(taskResult, parameters);
                    reportBytes = htmlContent.getBytes(StandardCharsets.UTF_8);
                    log.info("HTML контент сгенерирован.");
                    break;

                case PDF:
                    try {
                        // Генерируем PDF с помощью Puppeteer
                        String html = generateHtmlReport(taskResult, parameters);
                        reportBytes = puppeteerService.generatePdfFromHtml(html);
                        log.info("PDF контент сгенерирован с помощью Puppeteer.");
                    } catch (Exception pdfEx) {
                        log.error("Не удалось сгенерировать PDF с помощью Puppeteer: {}. Возвращаем HTML.", pdfEx.getMessage(), pdfEx);
                        actualFileFormat = ReportFileFormat.HTML;
                        reportBytes = generateHtmlReport(taskResult, parameters).getBytes(StandardCharsets.UTF_8);
                        s3Key = generateS3Key(actualFileFormat);
                        contentType = actualFileFormat.getContentType();
                    }
                    break;

                default:
                    log.error("Неподдерживаемый формат отчета: {}", fileFormat);
                    throw new IllegalArgumentException("Неподдерживаемый формат отчета: " + fileFormat);
            }

            if (reportBytes == null) {
                throw new RuntimeException("Report bytes is null for checkId: " + taskResult.getCheckId());
            }

            log.info("Загрузка отчета в S3: key={}, contentType={}, actualFormat={}",
                s3Key, contentType, actualFileFormat);
            String s3Url = s3Service.uploadGeneratedReport(s3Key, reportBytes, contentType);
            log.info("Отчет успешно загружен в S3: {}", s3Url);
            return new ReportGenerationResult(
                s3Url,
                actualFileFormat
            );

        } catch (Exception e) {
            log.error("Критическая ошибка при генерации или загрузке отчета для checkId: {}: {}", taskResult.getCheckId(), e.getMessage(), e);
            throw new IOException("Ошибка при генерации или загрузке отчета: " + e.getMessage(), e);
        }
    }

    private String generateS3Key(ReportFileFormat fileFormat) {
        String uuid = UUID.randomUUID().toString();
        String filename = REPORT_FILENAME_PREFIX + uuid + "." + fileFormat.getExtension();
        return REPORT_S3_FOLDER + filename;
    }

    /**
     * Генерация HTML отчета с дополнительными параметрами
     */
    public String generateHtmlReport(TaskResult result, ReportParameters parameters) {
        log.info("Генерация HTML отчета для checkId: {}", result.getCheckId());
        Context context = prepareContext(result, parameters);
        return templateEngine.process("report-template", context); // Use your existing template name
    }

    /**
     * Подготовка контекста для шаблона отчета с дополнительными параметрами
     */
    private Context prepareContext(TaskResult result, ReportParameters parameters) {
        Context context = new Context(Locale.forLanguageTag("ru"));
        LocalDateTime checkTime = LocalDateTime.now();

        context.setVariable("checkId", result.getCheckId());
        context.setVariable("checkDateTime", checkTime);
        context.setVariable("wordCount", result.getWordCount());

        Double plagiarism = result.getPlagiarismPercentage();
        // Multiply coverage by 100 for HTML context too, if the template expects it now
        if (result.getSources() != null) {
            result.getSources().forEach(s -> {
                // This modifies the source object in place for the template
                // Consider creating a DTO if you don't want to modify the original TaskResult
                if (s.getCoverage() != null) {
                    s.setSourceName(s.getSourceName().replace(".txt", ""));
                    s.setCoverage(s.getCoverage() * 100.0);
                }
            });
        }

        Double originality = calculateOriginality(plagiarism);
        context.setVariable("plagiarismPercentage", plagiarism); // Keep raw plagiarism %
        context.setVariable("originalityPercentage", originality);
        context.setVariable("aiPercentage", result.getAiPercentage());
        context.setVariable("sources", result.getSources()); // Pass potentially modified sources

        // Добавляем опциональные параметры, если они предоставлены
        if (parameters != null) {
            context.setVariable("university", parameters.getUniversity() == null ? "Не указано" : parameters.getUniversity());
            context.setVariable("department", parameters.getDepartment() == null ? "Не указано" : parameters.getDepartment());
            context.setVariable("student", parameters.getStudent() == null ? "Не указано" : parameters.getStudent());
            context.setVariable("reviewer", parameters.getReviewer() == null ? "Не указано" : parameters.getReviewer());
            // Всегда устанавливаем includeUnderlines в true
            context.setVariable("includeUnderlines", true);
        }
        return context;
    }

    private Double calculateOriginality(Double plagiarismPercentage) {
        if (plagiarismPercentage == null) return null;
        BigDecimal hundred = BigDecimal.valueOf(100.0);
        // IMPORTANT: calculation uses raw plagiarism value (0.0 to 1.0 range assumed)
        BigDecimal plagiarism = BigDecimal.valueOf(plagiarismPercentage);
        // If plagiarismPercentage is already 0-100, adjust calculation:
        // BigDecimal plagiarism = BigDecimal.valueOf(plagiarismPercentage / 100.0);
        return hundred.subtract(plagiarism).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }

    /**
     * Генерация или получение существующего отчета в зависимости от параметров
     */
    public String generateOrGetReport(Long userId, Long checkId, ReportParameters parameters) throws IOException {
        // Проверяем доступ пользователя к проверке
        Check check = checkRepository.findById(checkId)
            .orElseThrow(() -> new IllegalArgumentException("Проверка не найдена с ID: " + checkId));

        // Вычисляем хэш параметров для сравнения
        String parametersHash = calculateParametersHash(parameters);

        // Ищем существующие настройки отчета
        Optional<ReportSettings> existingSettings = reportSettingsRepository.findByUserIdAndCheckId(userId, checkId);

        if (existingSettings.isPresent() && parametersHash.equals(existingSettings.get().getParametersHash())) {
            // Если настройки не изменились, возвращаем существующую ссылку
            log.info("Используем существующий отчет для checkId: {}", checkId);
            return existingSettings.get().getReportUrl();
        } else {
            // Создаем TaskResult из данных Check
            TaskResult taskResult = createTaskResultFromCheck(check);

            // Генерируем новый отчет
            ReportGenerationResult s3Url = generateReportAndUpload(taskResult, parameters);

            parameters.setFormat(s3Url.actualFormat());

            // Сохраняем или обновляем настройки
            ReportSettings settings;
            if (existingSettings.isPresent()) {
                settings = existingSettings.get();
                settings.setUniversity(parameters.getUniversity());
                settings.setDepartment(parameters.getDepartment());
                settings.setStudent(parameters.getStudent());
                settings.setReviewer(parameters.getReviewer());
                settings.setFormat(parameters.getFormat());
                settings.setReportUrl(s3Url.url());
                settings.setParametersHash(parametersHash);
            } else {
                settings = ReportSettings.builder()
                    .userId(userId)
                    .checkId(checkId)
                    .university(parameters.getUniversity())
                    .department(parameters.getDepartment())
                    .student(parameters.getStudent())
                    .reviewer(parameters.getReviewer())
                    .format(parameters.getFormat())
                    .reportUrl(s3Url.url())
                    .parametersHash(parametersHash)
                    .build();
            }

            reportSettingsRepository.save(settings);
            log.info("Сгенерирован новый отчет для checkId: {}", checkId);

            return s3Url.url();
        }
    }

    /**
     * Получить настройки отчета для пользователя и проверки
     */
    public ReportSettings getReportSettings(Long userId, Long checkId) {
        return reportSettingsRepository.findByUserIdAndCheckId(userId, checkId)
            .orElse(ReportSettings.builder()
                .userId(userId)
                .checkId(checkId)
                .format(ReportFileFormat.PDF)
                .build());
    }

    /**
     * Вычисляет хэш параметров отчета для определения изменений
     */
    private String calculateParametersHash(ReportParameters parameters) {
        String sb = (parameters.getUniversity() == null ? "" : parameters.getUniversity()) +
            "|" + (parameters.getDepartment() == null ? "" : parameters.getDepartment()) +
            "|" + (parameters.getStudent() == null ? "" : parameters.getStudent()) +
            "|" + (parameters.getReviewer() == null ? "" : parameters.getReviewer()) +
            "|" + parameters.getFormat().name();

        return DigestUtils.md5Hex(sb);
    }

    /**
     * Вспомогательный метод для создания TaskResult из данных Check
     */
    private TaskResult createTaskResultFromCheck(Check check) {
        TaskResult taskResult = new TaskResult();
        taskResult.setCheckId(check.getId().toString());
        taskResult.setPlagiarismPercentage(check.getUniqueness());
        taskResult.setAiPercentage(check.getAiCheckLevel());
        taskResult.setWordCount(check.getWordCount());

        // Получаем источники заимствований
        taskResult.setSources(getSourcesForCheck(check.getId()));

        return taskResult;
    }

    /**
     * Получает источники заимствований для проверки
     */
    private java.util.List<org.identics.monolith.web.dto.kafka.Source> getSourcesForCheck(Long checkId) {
        java.util.List<org.identics.monolith.web.dto.kafka.Source> sources = new java.util.ArrayList<>();

        documentSourceRepository.findByCheck_Id(checkId).forEach(source -> {
            org.identics.monolith.web.dto.kafka.Source sourceItem = new org.identics.monolith.web.dto.kafka.Source();
            sourceItem.setSourceUuid(source.getSourceDocumentRegistry().getDocUuid().toString());
            sourceItem.setSourceName(source.getSourceDocumentRegistry().getSourceInfo());
            sourceItem.setCoverage(source.getCoverage());
            sources.add(sourceItem);
        });

        return sources;
    }
}