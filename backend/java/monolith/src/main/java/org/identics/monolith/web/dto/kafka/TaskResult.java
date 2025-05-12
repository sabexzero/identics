package org.identics.monolith.web.dto.kafka;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class TaskResult {
    private String requestId;
    private String status;
    private Double plagiarismPercentage;
    private Double aiPercentage;
    private List<Source> sources;
    private Integer wordCount;
    private String checkId;
}