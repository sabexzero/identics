package org.identics.monolith.web.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.identics.monolith.service.ReportService;
import org.identics.monolith.web.dto.ErrorResponse;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/{userId}/documents")
@Tag(name = "Отчеты", description = "API для работы с отчетами о проверке")
@Validated
public class ReportController {
    private final ReportService reportService;
    
    @Operation(
        summary = "Получить отчет о проверке",
        description = "Генерирует и возвращает отчет о проверке документа на плагиат"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Отчет успешно сгенерирован"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Документ не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}/report")
    public ResponseEntity<Resource> getReport(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId,
        @PathVariable("id") @Parameter(name = "id", description = "ID документа") Long documentId,
        @RequestParam(required = false, defaultValue = "pdf") @Parameter(name = "format", description = "Формат отчета (pdf или html)") String format
    ) {
        Resource report = reportService.generateReport(documentId, format);
        
        MediaType contentType = format.equalsIgnoreCase("pdf") 
                ? MediaType.APPLICATION_PDF 
                : MediaType.TEXT_HTML;
        
        String filename = "report_" + documentId + "." + format.toLowerCase();
        
        return ResponseEntity.ok()
                .contentType(contentType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(report);
    }
} 