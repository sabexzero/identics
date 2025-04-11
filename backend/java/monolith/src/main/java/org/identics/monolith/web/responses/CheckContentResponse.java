package org.identics.monolith.web.responses;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.identics.monolith.domain.check.Check;
import org.identics.monolith.domain.check.CheckContent;
import org.identics.monolith.domain.check.ContentType;
import org.identics.monolith.domain.check.ai.AiCheckStatus;
import org.identics.monolith.domain.check.plagiarism.PlagiarismCheckStatus;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CheckContentResponse {
    private Long id;
    private Long userId;
    private String title;
    private ContentType contentType;
    private Long folderId;
    private String content;

    private LocalDateTime dateTime;
    private PlagiarismCheckStatus plagiarismCheckStatus;
    private Double plagiarismLevel;
    private AiCheckStatus aiCheckStatus;
    private Integer aiCheckLevel;

    // Конструктор для удобства инициализации
    public CheckContentResponse(CheckContent checkContent, Check check) {
        this.id = checkContent.getId();
        this.userId = checkContent.getUserId();
        this.title = checkContent.getTitle();
        this.contentType = checkContent.getContentType();
        this.folderId = checkContent.getFolderId();
        this.content = checkContent.getText();

        if (check != null) { // Проверяем, что объект Check не null
            this.dateTime = check.getDateTime();
            this.plagiarismCheckStatus = check.getPlagiarismCheckStatus();
            this.plagiarismLevel = check.getPlagiarismLevel();
            this.aiCheckStatus = check.getAiCheckStatus();
            this.aiCheckLevel = check.getAiCheckLevel();
        }
    }
}
