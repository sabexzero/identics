package org.identics.monolith.web.controllers;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.identics.monolith.dto.CheckCompleteMessage;
import org.identics.monolith.service.check.CheckService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/webhook/v1/documents")
@Tag(name = "Документы", description = "API для работы с документами и их проверками")
@Validated
public class DocumentWebhookController {
    private final CheckService checkService;
    
    @Hidden
    @Operation(
        summary = "Вебхук результата проверки",
        description = "Эндпоинт для получения результатов завершенной проверки"
    )
    @PostMapping("/{checkId}")
    public ResponseEntity<Void> checkWebhook(
        @PathVariable @Parameter(name = "checkId", description = "ID проверки") Long checkId,
        @RequestBody @Parameter(name = "result", description = "Результат проверки") CheckCompleteMessage checkCompleteMessage
    ) {
        checkService.handleCheckResult(checkId, checkCompleteMessage);
        return ResponseEntity.ok().build();
    }
} 