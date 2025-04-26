package org.identics.monolith.web.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.identics.monolith.web.responses.TagResponse;
import org.identics.monolith.service.TagService;
import org.identics.monolith.web.requests.CreateTagRequest;
import org.identics.monolith.web.requests.UpdateTagRequest;
import org.identics.monolith.web.responses.ApiListResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/{userId}/tags")
@Tag(name = "Теги", description = "API для работы с тегами документов")
public class TagController {
    private final TagService tagService;
    
    @Operation(
        summary = "Получить теги пользователя",
        description = "Возвращает список всех тегов, созданных пользователем"
    )
    @GetMapping
    public ResponseEntity<ApiListResponse<TagResponse>> getUserTags(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId
    ) {
        return ResponseEntity.ok(tagService.getUserTags(userId));
    }
    
    @Operation(
        summary = "Создать новый тег",
        description = "Создает новый тег для пользователя"
    )
    @PostMapping
    public ResponseEntity<TagResponse> createTag(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId,
        @RequestBody @Parameter(name = "request", description = "Данные для создания тега") CreateTagRequest request
    ) {
        return ResponseEntity.ok(tagService.createTag(userId, request));
    }
    
    @Operation(
        summary = "Обновить тег",
        description = "Обновляет данные существующего тега"
    )
    @PutMapping("/{id}")
    public ResponseEntity<TagResponse> updateTag(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId,
        @PathVariable("id") @Parameter(name = "id", description = "ID тега") Long tagId,
        @RequestBody @Parameter(name = "request", description = "Данные для обновления тега") UpdateTagRequest request
    ) {
        return ResponseEntity.ok(tagService.updateTag(tagId, request));
    }
    
    @Operation(
        summary = "Удалить тег",
        description = "Удаляет тег и все его связи с документами"
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId,
        @PathVariable("id") @Parameter(name = "id", description = "ID тега") Long tagId
    ) {
        tagService.deleteTag(tagId);
        return ResponseEntity.noContent().build();
    }
} 