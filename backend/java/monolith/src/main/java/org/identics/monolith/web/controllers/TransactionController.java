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
import org.identics.monolith.service.TransactionService;
import org.identics.monolith.web.dto.ErrorResponse;
import org.identics.monolith.web.requests.AddChecksRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/{userId}/transactions")
@Tag(name = "Транзакции", description = "API для работы с историей транзакций")
@Validated
public class TransactionController {
    private final TransactionService transactionService;
    
    @Operation(
        summary = "Получить историю транзакций",
        description = "Возвращает постраничный список транзакций пользователя"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Успешное получение списка транзакций"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Пользователь не найден", 
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<Page<TransactionDTO>> getTransactions(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId,
        @RequestParam(defaultValue = "0") @Parameter(name = "page", description = "Номер страницы (начинается с 0)") int page,
        @RequestParam(defaultValue = "20") @Parameter(name = "size", description = "Количество элементов на странице") int size
    ) {
        Page<TransactionDTO> transactions = transactionService.getUserTransactions(userId, page, size);
        return ResponseEntity.ok(transactions);
    }

    @Operation(
        summary = "Пополнить количество проверок",
        description = "Добавляет указанное количество проверок пользователю"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Проверки успешно добавлены"),
        @ApiResponse(responseCode = "400", description = "Неверный запрос",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Пользователь не найден",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<TransactionDTO> addChecks(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId,
        @Valid @RequestBody @Parameter(name = "request", description = "Данные о покупке проверок") AddChecksRequest request
    ) {
        TransactionDTO transaction = transactionService.addChecks(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(transaction);
    }
} 