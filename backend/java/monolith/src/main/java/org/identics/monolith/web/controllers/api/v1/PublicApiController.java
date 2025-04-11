package org.identics.monolith.web.controllers.api.v1;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.InputStream;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.identics.monolith.domain.check.ContentType;
import org.identics.monolith.dto.UserProfileDTO;
import org.identics.monolith.service.PublicApiService;
import org.identics.monolith.service.UserProfileService;
import org.identics.monolith.service.document.DocumentService;
import org.identics.monolith.service.facade.CheckFacade;
import org.identics.monolith.web.dto.ErrorResponse;
import org.identics.monolith.web.requests.UploadContentRequest;
import org.identics.monolith.web.responses.DocumentWithTagsResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/public")
@Tag(name = "Публичный API", description = "API доступный по API ключу с ограничением запросов")
@Validated
public class PublicApiController {
    private final UserProfileService userProfileService;
    private final DocumentService documentService;
    private final PublicApiService publicApiService;
    private final CheckFacade checkFacade;

    @Operation(
        summary = "Получить профиль текущего пользователя",
        description = "Возвращает данные профиля пользователя, определенного по API ключу"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение профиля"),
        @ApiResponse(responseCode = "401", description = "Неверный API ключ",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "429", description = "Превышен лимит запросов",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getCurrentUserProfile(
        @RequestHeader("X-API-Key") String apiKey) {
        Long userId = publicApiService.validateApiKeyAndGetUserId(apiKey);
        UserProfileDTO profile = userProfileService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }

    @Operation(
        summary = "Получить список документов",
        description = "Возвращает постраничный список документов пользователя"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение списка документов"),
        @ApiResponse(responseCode = "401", description = "Неверный API ключ",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "429", description = "Превышен лимит запросов",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/documents")
    public ResponseEntity<Page<DocumentWithTagsResponse>> getDocuments(
        @RequestHeader("X-API-Key") String apiKey,
        @RequestParam(defaultValue = "0") @Parameter(name = "page", description = "Номер страницы (начинается с 0)") int page,
        @RequestParam(defaultValue = "20") @Parameter(name = "size", description = "Количество элементов на странице") int size
    ) {
        Long userId = publicApiService.validateApiKeyAndGetUserId(apiKey);
        Page<DocumentWithTagsResponse> documents = documentService.getUserDocuments(userId, List.of(), "", null, null, page, size);
        return ResponseEntity.ok(documents);
    }

    @Operation(
        summary = "Проверить документ на плагиат",
        description = "Загружает документ и проверяет его на плагиат"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Документ успешно проверен"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Неверный API ключ",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "429", description = "Превышен лимит запросов",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/check-plagiarism")
    public ResponseEntity<Void> checkDocumentPlagiarism(
        @RequestHeader("X-API-Key") String apiKey,
        @RequestParam("file") @Parameter(name = "file", description = "Файл для проверки") MultipartFile file,
        @RequestParam(required = false) @Parameter(name = "tagIds", description = "Список ID тегов") List<Long> tagIds,
        @RequestParam(value = "name", required = false) @Parameter(name = "title", description = "Название документа") String title
    ) throws IOException {
        Long userId = publicApiService.validateApiKeyAndGetUserId(apiKey);

        checkFacade.loadAndCheck(
            userId,
            UploadContentRequest.builder()
                .title(title)
                .contentType(ContentType.FILE)
                .tagIds(tagIds)
                .content(extractTextFromPdf(file.getInputStream()))
                .build()
        );

        return ResponseEntity.ok().build();
    }

    private String extractTextFromPdf(InputStream inputStream) throws IOException {
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
} 