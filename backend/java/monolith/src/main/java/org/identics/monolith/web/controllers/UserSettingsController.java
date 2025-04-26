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
import org.identics.monolith.service.UserSettingsService;
import org.identics.monolith.web.dto.ErrorResponse;
import org.identics.monolith.web.requests.UpdateUserSettingsRequest;
import org.identics.monolith.web.responses.UserSettingsResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/{userId}/settings")
@Tag(name = "Настройки пользователя", description = "API для работы с настройками пользователя")
@Validated
public class UserSettingsController {
    private final UserSettingsService userSettingsService;

    @Operation(
        summary = "Получить настройки пользователя",
        description = "Возвращает настройки пользователя по ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Настройки успешно получены"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Не авторизован",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Доступ запрещен",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Настройки не найдены",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<UserSettingsResponse> getUserSettings(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId
    ) {
        UserSettingsResponse settings = userSettingsService.getUserSettings(userId);
        return ResponseEntity.ok(settings);
    }

    @Operation(
        summary = "Обновить настройки пользователя",
        description = "Обновляет настройки пользователя"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Настройки успешно обновлены"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Не авторизован",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Доступ запрещен",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Настройки не найдены",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping
    public ResponseEntity<UserSettingsResponse> updateUserSettings(
        @PathVariable @Parameter(name = "userId", description = "ID пользователя") Long userId,
        @Valid @RequestBody @Parameter(name = "request", description = "Данные для обновления настроек пользователя") UpdateUserSettingsRequest request
    ) {
        UserSettingsResponse updatedSettings = userSettingsService.updateUserSettings(userId, request);
        return ResponseEntity.ok(updatedSettings);
    }
}