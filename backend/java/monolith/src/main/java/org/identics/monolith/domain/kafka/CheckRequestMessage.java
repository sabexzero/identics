package org.identics.monolith.domain.kafka;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckRequestMessage {
    private Long checkId;
    private Integer requestsInOrder;
    private String text;
    private Boolean needAiCheck;
    private Boolean needPlagiarismCheck;
    private Long contentId;
}
