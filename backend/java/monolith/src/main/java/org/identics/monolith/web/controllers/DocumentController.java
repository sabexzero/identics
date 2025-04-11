package org.identics.monolith.web.controllers;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.identics.monolith.domain.check.Check;
import org.identics.monolith.domain.check.ContentType;
import org.identics.monolith.dto.CheckCompleteMessage;
import org.identics.monolith.service.DocumentService;
import org.identics.monolith.service.TransactionService;
import org.identics.monolith.service.UserProfileService;
import org.identics.monolith.service.check.CheckService;
import org.identics.monolith.service.content.CheckContentService;
import org.identics.monolith.service.facade.CheckFacade;
import org.identics.monolith.web.dto.ErrorResponse;
import org.identics.monolith.web.requests.CheckRequest;
import org.identics.monolith.web.requests.UpdateDocumentRequest;
import org.identics.monolith.web.requests.UploadContentRequest;
import org.identics.monolith.web.responses.DocumentWithTagsResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/{userId}/documents")
@Tag(name = "Документы", description = "API для работы с документами и их проверками")
@Validated
public class DocumentController {
    private final DocumentService documentService;
    private final CheckService checkService;
    private final UserProfileService userProfileService;
    private final TransactionService transactionService;
    private final CheckFacade checkFacade;
    
    // ---------- Методы для работы с документами ----------
    
    @Operation(
        summary = "Получить список документов",
        description = "Возвращает постраничный список документов пользователя с возможностью фильтрации по папке и тегам"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение списка документов"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Не авторизован", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Доступ запрещен", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<Page<DocumentWithTagsResponse>> getDocuments(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @RequestParam(required = false) @Parameter(name = "tagIds", description = "Список ID тегов для фильтрации") List<Long> tagIds,
        @RequestParam(defaultValue = "0") @Parameter(name = "page", description = "Номер страницы (начинается с 0)") int page,
        @RequestParam(defaultValue = "10") @Parameter(name = "size", description = "Количество элементов на странице") int size
    ) {
        Page<DocumentWithTagsResponse> documents = documentService.getUserDocuments(userId, tagIds, page, size);
        return ResponseEntity.ok(documents);
    }
    
    @Operation(
        summary = "Получить документ",
        description = "Возвращает данные документа по ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение документа"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Не авторизован", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Доступ запрещен", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Документ не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<DocumentWithTagsResponse> getDocument(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @PathVariable("id") @Parameter(name = "id", description = "ID документа") Long documentId
    ) {
        DocumentWithTagsResponse document = documentService.getDocument(documentId);
        return ResponseEntity.ok(document);
    }
    
    @Operation(
        summary = "Обновить документ",
        description = "Обновляет данные документа (заголовок и теги)"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Документ успешно обновлен"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Не авторизован", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Доступ запрещен", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Документ не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<DocumentWithTagsResponse> updateDocument(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @PathVariable("id") @Parameter(name = "id", description = "ID документа") Long documentId,
        @Valid @RequestBody @Parameter(name = "request", description = "Данные для обновления документа") UpdateDocumentRequest request
    ) {
        DocumentWithTagsResponse document = documentService.updateDocument(documentId, request);
        return ResponseEntity.ok(document);
    }
    
    @Operation(
        summary = "Удалить документ",
        description = "Удаляет документ, его проверки и связи с тегами"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Документ успешно удален"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Не авторизован", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Доступ запрещен", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Документ не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @PathVariable("id") @Parameter(name = "id", description = "ID документа") Long documentId
    ) {
        documentService.deleteDocument(documentId);
        return ResponseEntity.noContent().build();
    }
    
    // ---------- Методы для загрузки контента ----------
    
    @Operation(
        summary = "Загрузить текстовый документ",
        description = "Загружает текстовый документ с опциональной проверкой на плагиат и AI-генерацию"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Документ успешно загружен"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Не авторизован", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Доступ запрещен", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Пользователь не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/text")
    public ResponseEntity<DocumentWithTagsResponse> uploadTextDocument(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @RequestParam @Parameter(name = "folderId", description = "ID папки для документа") Long folderId,
        @RequestParam(defaultValue = "true") @Parameter(name = "plagiarismCheck", description = "Выполнить проверку на плагиат") Boolean plagiarism,
        @RequestParam(defaultValue = "true") @Parameter(name = "aiDetection", description = "Выполнить определение AI-генерации") Boolean ai,
        @Valid @RequestBody @Parameter(name = "content", description = "Данные документа") UploadContentRequest request
    ) {
        try {
            checkFacade.loadAndCheck(userId, folderId, plagiarism, ai, request);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @Operation(
        summary = "Загрузить файл документа",
        description = "Загружает PDF-файл с опциональной проверкой на плагиат и AI-генерацию"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Документ успешно загружен"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Не авторизован", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Доступ запрещен", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Пользователь не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/file")
    public ResponseEntity<DocumentWithTagsResponse> uploadFileDocument(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @RequestParam @Parameter(name = "folderId", description = "ID папки для документа") Long folderId,
        @RequestParam("file") @Parameter(name = "file", description = "PDF-файл для загрузки") MultipartFile file,
        @RequestParam(defaultValue = "true") @Parameter(name = "plagiarismCheck", description = "Выполнить проверку на плагиат") Boolean plagiarism,
        @RequestParam(defaultValue = "true") @Parameter(name = "aiDetection", description = "Выполнить определение AI-генерации") Boolean ai
    ) throws IOException {
        if (!file.isEmpty()) {
            try (InputStream inputStream = file.getInputStream()) {
                String pdfContent = extractTextFromPdf(inputStream);

                UploadContentRequest request = UploadContentRequest.builder()
                    .content(pdfContent)
                    .title(file.getOriginalFilename())
                    .contentType(ContentType.FILE)
                    .build();

                checkFacade.loadAndCheck(userId, folderId, plagiarism, ai, request);
                return ResponseEntity.status(HttpStatus.CREATED).build();
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.badRequest().build();
    }
    
    // ---------- Методы для проверок ----------
    
    @Operation(
        summary = "Запустить дополнительную проверку документа",
        description = "Запускает проверку документа на плагиат или AI-генерацию, если такая проверка еще не проводилась"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Проверка успешно запущена"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос или проверка уже выполнена", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Не авторизован", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Доступ запрещен", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Документ не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/{id}/check")
    public ResponseEntity<Void> checkDocument(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @PathVariable("id") @Parameter(name = "id", description = "ID документа") Long documentId,
        @RequestParam(defaultValue = "false") @Parameter(name = "plagiarism", description = "Выполнить проверку на плагиат") Boolean plagiarism,
        @RequestParam(defaultValue = "false") @Parameter(name = "ai", description = "Выполнить определение AI-генерации") Boolean ai
    ) {
        try {
            // Проверяем, была ли уже выполнена такая проверка
            Check existingCheck = checkService.getCheckByContentId(documentId);
            
            // Определяем, нужно ли выполнять проверки
            boolean needPlagiarismCheck = plagiarism && !existingCheck.isPlagiarismCheckPerformed();
            boolean needAiCheck = ai && !existingCheck.isAiCheckPerformed();
            
            // Если обе проверки уже выполнены, возвращаем ошибку
            if (!needPlagiarismCheck && !needAiCheck) {
                return ResponseEntity.badRequest().body(null);
            }
            
            // Списываем проверку и записываем транзакцию
            userProfileService.useCheck(userId);
            transactionService.useCheck(userId);
            
            // Запускаем проверку
            checkService.check(CheckRequest.builder()
                .contentId(documentId)
                .isAiCheck(needAiCheck)
                .isPlagiarismCheck(needPlagiarismCheck)
                .build());
                
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @Hidden
    @Operation(
        summary = "Вебхук результата проверки",
        description = "Эндпоинт для получения результатов завершенной проверки"
    )
    @PostMapping("/documents/check/webhook/{checkId}")
    public ResponseEntity<Void> checkWebhook(
        @PathVariable @Parameter(name = "checkId", description = "ID проверки") Long checkId,
        @RequestBody @Parameter(name = "result", description = "Результат проверки") CheckCompleteMessage checkCompleteMessage
    ) {
        checkService.handleCheckResult(checkId, checkCompleteMessage);
        return ResponseEntity.ok().build();
    }
    
    // ---------- Вспомогательные методы ----------
    
    private String extractTextFromPdf(InputStream inputStream) throws IOException {
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            return pdfStripper.getText(document);
        }
    }
} 