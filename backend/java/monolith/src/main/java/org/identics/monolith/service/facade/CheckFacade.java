package org.identics.monolith.service.facade;

import com.fasterxml.jackson.core.JsonProcessingException;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.domain.check.Document;
import org.identics.monolith.service.document.DocumentService;
import org.identics.monolith.service.TransactionService;
import org.identics.monolith.service.UserProfileService;
import org.identics.monolith.service.check.CheckService;
import org.identics.monolith.web.requests.CheckRequest;
import org.identics.monolith.web.requests.UploadContentRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class CheckFacade {
    private final CheckService checkService;
    private final DocumentService documentService;
    private final UserProfileService userProfileService;
    private final TransactionService transactionService;

    /**
     * Метод для загрузки пользователем и немедленной проверки (существующий).
     */
    public void loadAndCheck(Long userId, UploadContentRequest request, MultipartFile file) throws IOException {
        log.info("Загрузка и проверка для пользователя {}, тип контента: {}", userId, request.getContentType());
        // Проверяем существование пользователя
        userProfileService.getUserProfile(userId);

        // Загружаем документ (этот метод уже устанавливает URL и ContentType)
        Document uploadedDocument = documentService.uploadDocument(request, userId, file);
        log.info("Документ загружен: id={}, url={}", uploadedDocument.getId(), uploadedDocument.getUrl());


        // Инициируем проверки
        try {
            checkService.check(
                CheckRequest.builder()
                    .contentId(uploadedDocument.getId())
                    // Устанавливаем тип контента из загруженного документа
                    .contentType(uploadedDocument.getContentType()) // Используем тип из Document
                    .contentUrl(uploadedDocument.getUrl()) // URL из Document
                    // Предполагаем, что при загрузке пользователем обе проверки нужны
                    .isAiCheck(true)
                    .isPlagiarismCheck(true)
                    .build()
            );
            log.info("Проверка инициирована для документа id={}", uploadedDocument.getId());
        } catch (JsonProcessingException e) {
            // Ошибка отправки в Kafka
            log.error("Ошибка отправки задачи проверки в Kafka для документа id={}", uploadedDocument.getId(), e);
            // TODO: Решить, как обработать (откатить транзакцию? уведомить пользователя?)
            throw new RuntimeException("Ошибка инициации проверки", e); // Перебрасываем или обрабатываем иначе
        }


        // Записываем транзакцию использования проверки
        transactionService.useCheck(userId);
        log.info("Транзакция проверки записана для пользователя {}", userId);
    }
}
