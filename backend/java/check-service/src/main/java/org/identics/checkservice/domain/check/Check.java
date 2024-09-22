package org.identics.checkservice.domain.check;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.identics.checkservice.domain.check.ai.AiCheckResult;
import org.identics.checkservice.domain.check.ai.AiCheckStatus;
import org.identics.checkservice.domain.check.plagiarism.PlagiarismCheckResult;
import org.identics.checkservice.domain.check.plagiarism.PlagiarismCheckStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "checks")
public class Check {
    @Id
    private String id;

    private String title;
    private Long userId;
    private LocalDateTime dateTime;
    private ContentType contentType;
    private CheckContent content;

    private PlagiarismCheckResult plagiarismCheckResult;
    private AiCheckResult aiCheckResult;

    public Check updateResults(
            Integer plagiarism,
            Integer ai
    ) {
        return Check.builder()
                .id(id)
                .title(title)
                .dateTime(dateTime)
                .contentType(contentType)
                .content(content)
                .plagiarismCheckResult(
                        plagiarism == null
                                ? PlagiarismCheckResult.builder()
                                    .result(null)
                                    .status(PlagiarismCheckStatus.NOT_PERFORM)
                                    .build()
                                : PlagiarismCheckResult.builder()
                                    .result(plagiarism)
                                    .status(PlagiarismCheckStatus.COMPLETE)
                                    .build()
                )
                .aiCheckResult(
                        ai == null
                                ? AiCheckResult.builder()
                                    .result(null)
                                    .status(AiCheckStatus.NOT_PERFORM)
                                    .build()
                                : AiCheckResult.builder()
                                    .result(ai)
                                    .status(AiCheckStatus.COMPLETE)
                                    .build()
                )
                .build();
    }
}
