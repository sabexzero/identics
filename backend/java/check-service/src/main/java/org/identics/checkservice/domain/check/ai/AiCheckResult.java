package org.identics.checkservice.domain.check.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiCheckResult {
    private AiCheckStatus status;
    private Integer result;

    public static AiCheckResult fabric(AiCheckStatus status) {
        return AiCheckResult.builder()
                .status(status)
                .result(null)
                .build();
    }
}
