package org.identics.monolith.domain.check.ai;

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
}
