package org.identics.monolith.web.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddChecksRequest {
    @NotNull(message = "Количество проверок обязательно")
    @Min(value = 1, message = "Количество проверок должно быть не менее 1")
    private Integer checksCount;
    
    @NotNull(message = "Сумма платежа обязательна")
    @Positive(message = "Сумма платежа должна быть положительной")
    private BigDecimal amount;
} 