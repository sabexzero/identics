package org.identics.monolith.domain.check.plagiarism;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlagiarismCheckResult {
    private PlagiarismCheckStatus status;
    private Integer result;
}
