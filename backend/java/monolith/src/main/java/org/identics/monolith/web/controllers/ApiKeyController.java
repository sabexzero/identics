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
import org.identics.monolith.configuration.security.RequiresUserIdMatch;
import org.identics.monolith.dto.ApiKeyDTO;
import org.identics.monolith.service.ApiKeyService;
import org.identics.monolith.web.dto.ErrorResponse;
import org.identics.monolith.web.requests.CreateApiKeyRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequiresUserIdMatch
@RequestMapping("/api/v1/{userId}/api-keys")
@Tag(name = "API Ключи", description = "API для управления API ключами")
@Validated
public class ApiKeyController {
    private final ApiKeyService apiKeyService;
    
    @Operation(
        summary = "Получить список API ключей",
        description = "Возвращает список всех API ключей пользователя"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение списка ключей"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Пользователь не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<ApiKeyDTO>> getUserApiKeys(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId
    ) {
        return ResponseEntity.ok(apiKeyService.getUserApiKeys(userId));
    }
    
    @Operation(
        summary = "Создать новый API ключ",
        description = "Создает новый API ключ для пользователя"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "API ключ успешно создан"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Пользователь не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<ApiKeyDTO> createApiKey(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId,
        @RequestBody @Valid @Parameter(name = "request", description = "Данные для создания API ключа") CreateApiKeyRequest request
    ) {
        ApiKeyDTO apiKey = apiKeyService.createApiKey(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(apiKey);
    }
    
    @Operation(
        summary = "Отозвать API ключ",
        description = "Отзывает API ключ, делая его недействительным"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "API ключ успешно отозван"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "API ключ или пользователь не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{keyId}")
    public ResponseEntity<Void> revokeApiKey(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId,
        @PathVariable @Parameter(name = "keyId", description = "Идентификатор API ключа") Long keyId
    ) {
        apiKeyService.revokeApiKey(userId, keyId);
        return ResponseEntity.noContent().build();
    }
} 