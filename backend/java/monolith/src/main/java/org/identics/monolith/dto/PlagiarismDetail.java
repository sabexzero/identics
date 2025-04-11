package org.identics.monolith.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class PlagiarismDetail {
    @JsonProperty("paragraph_index")
    private Integer paragraphIndex;

    @JsonProperty("plagiarism_percent")
    private Double plagiarismPercent;

    @JsonProperty("total_plagiarism_percent")
    private Double totalPlagiarismPercent;

    @JsonProperty("best_match")
    private BestMatch bestMatch;
}