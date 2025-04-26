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
    private Double coverage;
    private List<int[]> matchedSpans;
}