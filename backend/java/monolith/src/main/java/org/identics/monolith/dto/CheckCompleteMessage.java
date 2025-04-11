package org.identics.monolith.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckCompleteMessage {
    @JsonProperty("overall_plagiarism")
    private Double overallPlagiarism; // Общий процент плагиата
    @JsonProperty("details")
    private List<PlagiarismDetail> plagiarismDetails; // Детали проверки плагиата

    @JsonProperty("ai_check_result")
    private Double aiCheckResult;
}