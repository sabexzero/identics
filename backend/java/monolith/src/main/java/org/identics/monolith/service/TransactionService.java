package org.identics.monolith.service;

import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.transaction.Transaction;
import org.identics.monolith.domain.transaction.TransactionType;
import org.identics.monolith.dto.TransactionDTO;
import org.identics.monolith.repository.TransactionRepository;
import org.identics.monolith.web.requests.AddChecksRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserProfileService userProfileService;
    
    public Page<TransactionDTO> getUserTransactions(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return transactionRepository.findByUserIdOrderByDateTimeDesc(userId, pageable)
                .map(this::mapToDto);
    }
    
    public TransactionDTO addChecks(Long userId, AddChecksRequest request) {
        // Создаем запись транзакции
        Transaction transaction = Transaction.builder()
                .userId(userId)
                .dateTime(LocalDateTime.now())
                .amount(request.getAmount())
                .checksCount(request.getChecksCount())
                .type(TransactionType.PURCHASE)
                .description("Покупка проверок: " + request.getChecksCount())
                .build();
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Добавляем проверки пользователю
        userProfileService.addChecksToUser(userId, request.getChecksCount());
        
        return mapToDto(savedTransaction);
    }
    
    public TransactionDTO useCheck(Long userId) {
        // Создаем запись транзакции
        Transaction transaction = Transaction.builder()
                .userId(userId)
                .dateTime(LocalDateTime.now())
                .amount(null)
                .checksCount(1)
                .type(TransactionType.USAGE)
                .description("Использование проверки")
                .build();
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Списываем проверку у пользователя
        userProfileService.useCheck(userId);
        
        return mapToDto(savedTransaction);
    }
    
    public TransactionDTO addBonusChecks(Long userId, Integer checksCount, String description) {
        // Создаем запись транзакции
        Transaction transaction = Transaction.builder()
                .userId(userId)
                .dateTime(LocalDateTime.now())
                .amount(null)
                .checksCount(checksCount)
                .type(TransactionType.BONUS)
                .description(description)
                .build();
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        
        // Добавляем проверки пользователю
        userProfileService.addChecksToUser(userId, checksCount);
        
        return mapToDto(savedTransaction);
    }
    
    private TransactionDTO mapToDto(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .userId(transaction.getUserId())
                .dateTime(transaction.getDateTime())
                .amount(transaction.getAmount())
                .checksCount(transaction.getChecksCount())
                .type(transaction.getType())
                .description(transaction.getDescription())
                .build();
    }
} 