package org.identics.checkservice.domain.kafka;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckCompleteMessage {
    private String checkId;
    private Long userId;
    private Integer plagiarismCheckResult;
    private Integer aiCheckResult;
}
