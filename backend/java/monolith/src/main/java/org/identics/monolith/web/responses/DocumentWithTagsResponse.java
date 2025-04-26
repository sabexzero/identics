package org.identics.monolith.web.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.identics.monolith.web.responses.TagResponse;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentWithTagsResponse {
    private Long id;
    private String title;
    private Long userId;
    private LocalDateTime checkDate;
    private Double uniqueness;
    private Double aiLevel;
    private List<TagResponse> tags;
    private String reportUrl;
} 