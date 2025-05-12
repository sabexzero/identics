package org.identics.monolith.web.dto.kafka;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Source {
    private String sourceUuid;
    private String sourceName;
    private Double finalScore;
    private String method;
    private Double ngramCoverage;
    private List<int[]> ngramSpans;
    private Double vectorCoverage;
    private Integer vectorMatchesCount;
    
    // Keep original fields for backward compatibility
    private Double coverage;
    private List<int[]> matchedSpans;
}