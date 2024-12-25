package org.identics.checkservice.domain.check.plagiarism;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.identics.checkservice.domain.check.ai.AiCheckResult;
import org.identics.checkservice.domain.check.ai.AiCheckStatus;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlagiarismCheckResult {
    private PlagiarismCheckStatus status;
    private Integer result;

    public static PlagiarismCheckResult fabric(PlagiarismCheckStatus status) {
        return PlagiarismCheckResult.builder()
                .status(status)
                .result(null)
                .build();
    }
}
