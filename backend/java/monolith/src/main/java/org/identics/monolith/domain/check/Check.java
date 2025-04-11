package org.identics.monolith.domain.check;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.identics.monolith.domain.check.ai.AiCheckResult;
import org.identics.monolith.domain.check.ai.AiCheckStatus;
import org.identics.monolith.domain.check.plagiarism.PlagiarismCheckResult;
import org.identics.monolith.domain.check.plagiarism.PlagiarismCheckStatus;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table(name = "plagiarism_check")
public class Check {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dateTime;
    private Long contentId;

    private PlagiarismCheckStatus plagiarismCheckStatus;
    private Double plagiarismLevel;

    private AiCheckStatus aiCheckStatus;
    private Integer aiCheckLevel;

    /**
     * Проверяет, был ли уже выполнен анализ плагиата
     * @return true, если анализ был выполнен или не требуется
     */
    public boolean isPlagiarismCheckPerformed() {
        return plagiarismCheckStatus == PlagiarismCheckStatus.COMPLETE ||
               plagiarismCheckStatus == PlagiarismCheckStatus.NOT_PERFORM;
    }
    
    /**
     * Проверяет, был ли уже выполнен анализ AI-генерации
     * @return true, если анализ был выполнен или не требуется
     */
    public boolean isAiCheckPerformed() {
        return aiCheckStatus == AiCheckStatus.COMPLETE ||
               aiCheckStatus == AiCheckStatus.NOT_PERFORM;
    }
}
