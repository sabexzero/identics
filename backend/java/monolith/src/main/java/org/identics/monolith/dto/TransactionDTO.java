package org.identics.monolith.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.identics.monolith.domain.transaction.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private Long userId;
    private LocalDateTime dateTime;
    private BigDecimal amount;
    private Integer checksCount;
    private TransactionType type;
    private String description;
} 