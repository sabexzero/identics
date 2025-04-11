package org.identics.monolith.web.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import org.identics.monolith.domain.check.Check;
import org.identics.monolith.domain.check.ai.AiCheckStatus;
import org.identics.monolith.domain.check.plagiarism.PlagiarismCheckStatus;
import org.identics.monolith.domain.kafka.CheckRequestMessage;

@Builder
public record CheckRequest(
    @NotNull(message = "ID контента обязателен для проверки")
    Long contentId,
    
    @NotNull(message = "Необходимо указать, требуется ли проверка на AI-генерацию")
    Boolean isAiCheck,
    
    @NotNull(message = "Необходимо указать, требуется ли проверка на плагиат")
    Boolean isPlagiarismCheck
) {
    public Check toDomain() {
        return Check.builder()
            .id(null)
            .aiCheckStatus(
                isAiCheck
                    ? AiCheckStatus.IN_PROGRESS
                    : AiCheckStatus.NOT_PERFORM
            )
            .plagiarismCheckStatus(
                isPlagiarismCheck
                    ? PlagiarismCheckStatus.IN_PROGRESS
                    : PlagiarismCheckStatus.NOT_PERFORM
            )
            .contentId(contentId)
            .build();
    }

    public CheckRequestMessage toMessage(
        Long id,
        Integer requestsInOrder,
        Long contentId
    ) {
        return CheckRequestMessage.builder()
            .checkId(id)
            .needAiCheck(isAiCheck)
            .needPlagiarismCheck(isPlagiarismCheck)
            .requestsInOrder(requestsInOrder)
            .contentId(contentId)
            .build();
    }
}
