package org.identics.monolith.web.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.domain.check.ContentType;
import org.identics.monolith.service.document.DocumentService;
import org.identics.monolith.service.facade.CheckFacade;
import org.identics.monolith.web.dto.ErrorResponse;
import org.identics.monolith.web.requests.PlainContentRequest;
import org.identics.monolith.web.requests.UpdateDocumentRequest;
import org.identics.monolith.web.requests.UpdateDocumentTagsRequest;
import org.identics.monolith.web.requests.UploadContentRequest;
import org.identics.monolith.web.responses.ApiListResponse;
import org.identics.monolith.web.responses.DocumentWithTagsResponse;
import org.identics.monolith.web.responses.GetDocumentByIdResponse;
import org.identics.monolith.web.responses.TagResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/{userId}/documents")
@Tag(name = "Документы", description = "API для работы с документами и их проверками")
@Validated
public class DocumentController {
    private final DocumentService documentService;
    private final CheckFacade checkFacade;

    // ---------- Методы для работы с документами ----------

    @Operation(
        summary = "Получить список документов",
        description = "Возвращает постраничный список документов пользователя с возможностью фильтрации по тегам и поиску"
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
        @RequestParam(required = false) @Parameter(name = "search", description = "Поисковый запрос") String searchTerm,
        @RequestParam(required = false) @Parameter(name = "sortBy", description = "Поле для сортировки (title, date)") String sortBy,
        @RequestParam(required = false, defaultValue = "desc") @Parameter(name = "sortDirection", description = "Направление сортировки (asc, desc)") String sortDirection,
        @RequestParam(defaultValue = "0") @Parameter(name = "page", description = "Номер страницы (начинается с 0)") int page,
        @RequestParam(defaultValue = "10") @Parameter(name = "size", description = "Количество элементов на странице") int size
    ) {
        Page<DocumentWithTagsResponse> documents = documentService.getUserDocuments(
            userId, tagIds, searchTerm, sortBy, sortDirection, page, size);
        return ResponseEntity.ok(documents);
    }

    @Operation(
        summary = "Получить детальную информацию документа",
        description = "Возвращает подробные данные документа по ID со списком источников и выделений"
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
    public ResponseEntity<GetDocumentByIdResponse> getDocumentDetails(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @PathVariable("id") @Parameter(name = "id", description = "ID документа") Long documentId
    ) {
        GetDocumentByIdResponse document = documentService.getDocumentById(documentId);
        return ResponseEntity.ok(document);
    }

    @Operation(
        summary = "Получить теги документа",
        description = "Возвращает теги документа по ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение тегов документа"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Не авторизован",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Доступ запрещен",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Документ не найден",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}/tags")
    public ResponseEntity<ApiListResponse<TagResponse>> getDocumentTags(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @PathVariable("id") @Parameter(name = "id", description = "ID документа") Long documentId
    ) {
        ApiListResponse<TagResponse> response = documentService.getDocumentTags(documentId);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Обновить документ",
        description = "Обновляет теги документа"
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
    @PatchMapping("/{id}")
    public ResponseEntity<DocumentWithTagsResponse> updateDocumentTags(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @PathVariable("id") @Parameter(name = "id", description = "ID документа") Long documentId,
        @Valid @RequestBody @Parameter(name = "request", description = "Данные для обновления тегов документа") UpdateDocumentTagsRequest request
    ) {
        DocumentWithTagsResponse document = documentService.updateDocumentTags(documentId, request);
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
        description = "Загружает текстовый контент как документ типа 'plain' и инициирует проверку"
    )
    // ... ApiResponses ...
    @PostMapping(value = "/text", consumes = MediaType.APPLICATION_JSON_VALUE) // Указываем consumes
    public ResponseEntity<Void> uploadTextDocument(
        // Возвращаем Void или ID созданного документа/проверки
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @Valid @RequestBody @Parameter(name = "request", description = "Данные документа (включая text)") PlainContentRequest request // Предполагаем, что в UploadContentRequest есть поле String text;
    ) {
        // Устанавливаем тип контента как "plain"
        UploadContentRequest plainTextRequest = UploadContentRequest.builder()
            .content(request.getContent())
            .tagIds(request.getTagIds())
            .title(request.getTitle())
            .contentType(ContentType.PLAIN)
            .build();

        try {
            // Вызываем фасад, передавая null вместо файла
            // Важно: Метод uploadDocument в DocumentService должен уметь обрабатывать contentType="plain" без файла
            checkFacade.loadAndCheck(userId, plainTextRequest, null); // Передаем null как MultipartFile
            return ResponseEntity.status(HttpStatus.ACCEPTED).build(); // Используем 202 Accepted, т.к. проверка асинхронна
        } catch (IOException e) { // Этот exception теперь менее вероятен для text/plain
            log.error("Ошибка при обработке текстовой загрузки для пользователя {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.badRequest().build(); // Или другой статус ошибки
        } catch (IllegalArgumentException e) {
            log.warn("Ошибка валидации при загрузке текста для пользователя {}: {}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Непредвиденная ошибка при загрузке текста для пользователя {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(
        summary = "Загрузить файл документа",
        description = "Загружает файл (PDF, DOCX, TXT) и инициирует проверку"
    )
    // ... ApiResponses ...
    @PostMapping(value = "/file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE) // Указываем consumes
    public ResponseEntity<Void> uploadFileDocument(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @RequestParam("file") @Parameter(
            name = "file",
            description = "Файл документа (PDF, DOCX, TXT)", // Обновляем описание
            schema = @Schema(type = "string", format = "binary")
        ) MultipartFile file,
        @RequestParam("title") @Parameter(name = "title", description = "Название документа") String title, // Добавим title явно
        @RequestParam(required = false) @Parameter(name = "tagIds", description = "ID тегов") List<Long> tagIds
    ) {
        if (file == null || file.isEmpty()) {
            log.warn("Попытка загрузить пустой файл для пользователя {}", userId);
            return ResponseEntity.badRequest().build(); // Возвращаем 400 Bad Request
        }

        // ContentType будет определен внутри documentService.uploadDocument
        UploadContentRequest request = UploadContentRequest.builder()
            .title(title) // Используем переданный title
            .tagIds(tagIds)
            .build();

        try {
            checkFacade.loadAndCheck(userId, request, file);
            return ResponseEntity.status(HttpStatus.ACCEPTED).build(); // 202 Accepted
        } catch (IOException e) {
            log.error("Ошибка ввода-вывода при загрузке файла для пользователя {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (IllegalArgumentException e) {
            log.warn("Ошибка валидации при загрузке файла для пользователя {}: {}", userId, e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Непредвиденная ошибка при загрузке файла для пользователя {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
} 