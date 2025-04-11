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
import org.identics.monolith.domain.check.ContentType;
import org.identics.monolith.dto.CheckCompleteMessage;
import org.identics.monolith.service.document.DocumentService;
import org.identics.monolith.service.facade.CheckFacade;
import org.identics.monolith.web.dto.ErrorResponse;
import org.identics.monolith.web.requests.UpdateDocumentRequest;
import org.identics.monolith.web.requests.UploadContentRequest;
import org.identics.monolith.web.responses.DocumentWithTagsResponse;
import org.identics.monolith.web.responses.GetDocumentByIdResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
        @Valid @RequestBody @Parameter(name = "content", description = "Данные документа") UploadContentRequest request
    ) {
        try {
            checkFacade.loadAndCheck(userId, request);
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
    @PostMapping(value = "/file", consumes = { "multipart/form-data" })
    public ResponseEntity<DocumentWithTagsResponse> uploadFileDocument(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @RequestParam("file") @Parameter(
            name = "file", 
            description = "PDF-файл для загрузки",
            schema = @Schema(type = "string", format = "binary")
        ) MultipartFile file,
        @RequestParam("fileName") @Parameter(name = "title", description = "Название файла") String fileName,
        @RequestParam(required = false) @Parameter(name = "tagIds", description = "ID тегов для присвоения документу") List<Long> tagIds
    ) throws IOException {
        if (!file.isEmpty()) {
            try (InputStream inputStream = file.getInputStream()) {
                String pdfContent = extractTextFromPdf(inputStream);

                UploadContentRequest request = UploadContentRequest.builder()
                    .content(pdfContent)
                    .title(fileName)
                    .contentType(ContentType.FILE)
                    .tagIds(tagIds)
                    .build();

                checkFacade.loadAndCheck(userId, request);
                return ResponseEntity.status(HttpStatus.CREATED).build();
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.badRequest().build();
    }

    private String extractTextFromPdf(InputStream inputStream) throws IOException {
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
} 