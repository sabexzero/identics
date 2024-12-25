package org.identics.checkservice.web.requests;

import org.identics.checkservice.domain.check.Check;
import org.identics.checkservice.domain.check.CheckContent;
import org.identics.checkservice.domain.check.ContentType;
import org.identics.checkservice.domain.check.ai.AiCheckResult;
import org.identics.checkservice.domain.check.ai.AiCheckStatus;
import org.identics.checkservice.domain.check.plagiarism.PlagiarismCheckResult;
import org.identics.checkservice.domain.check.plagiarism.PlagiarismCheckStatus;
import org.identics.checkservice.domain.kafka.CheckRequestMessage;

public record CheckRequest(
        Long userId,
        ContentType contentType,
        CheckContent content,
        Boolean isAiCheck,
        Boolean isPlagiarismCheck
) {
    public Check toDomain() {
        return Check.builder()
                .id(null)
                .userId(userId)
                .aiCheckResult(
                        isAiCheck
                                ? AiCheckResult.fabric(AiCheckStatus.IN_PROGRESS)
                                : AiCheckResult.fabric(AiCheckStatus.NOT_PERFORM)
                )
                .plagiarismCheckResult(
                        isPlagiarismCheck
                                ? PlagiarismCheckResult.fabric(PlagiarismCheckStatus.IN_PROGRESS)
                                : PlagiarismCheckResult.fabric(PlagiarismCheckStatus.NOT_PERFORM)
                )
                .contentType(contentType)
                .content(content)
                .build();
    }

    public CheckRequestMessage toMessage(
            String id,
            Integer requestsInOrder,
            String text
    ) {
        return CheckRequestMessage.builder()
                .checkId(id)
                .needAiCheck(isAiCheck)
                .needPlagiarismCheck(isPlagiarismCheck)
                .requestsInOrder(requestsInOrder)
                .text(text)
                .build();
    }
}
