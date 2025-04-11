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
import org.identics.monolith.dto.TransactionDTO;
import org.identics.monolith.dto.UserProfileDTO;
import org.identics.monolith.service.TransactionService;
import org.identics.monolith.service.UserProfileService;
import org.identics.monolith.web.dto.ErrorResponse;
import org.identics.monolith.web.requests.AddChecksRequest;
import org.identics.monolith.web.requests.UpdateUserProfileRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/{userId}/profile")
@Tag(name = "Профиль", description = "API для работы с профилем пользователя")
@Validated
public class ProfileController {
    private final UserProfileService profileService;

    @Operation(
        summary = "Получить профиль пользователя",
        description = "Возвращает данные профиля пользователя, включая количество доступных проверок"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение профиля"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Пользователь не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<UserProfileDTO> getProfile(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId
    ) {
        UserProfileDTO profile = profileService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }
    
    @Operation(
        summary = "Обновить профиль пользователя",
        description = "Обновляет данные профиля пользователя"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Профиль успешно обновлен"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Пользователь не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping
    public ResponseEntity<UserProfileDTO> updateProfile(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId,
        @Valid @RequestBody @Parameter(name = "request", description = "Данные для обновления профиля") UpdateUserProfileRequest request
    ) {
        UserProfileDTO updatedProfile = profileService.updateUserProfile(userId, request);
        return ResponseEntity.ok(updatedProfile);
    }
} 