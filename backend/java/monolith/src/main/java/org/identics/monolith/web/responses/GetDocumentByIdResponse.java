package org.identics.monolith.web.responses;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetDocumentByIdResponse {
    private String title;
    private LocalDateTime date;
    private Integer wordCount;
    private Double uniqueness;
    private Double aiContent;

    private Long processingTime;
    
    private List<HighlightDTO> highlights;
    private List<SourceDTO> sources;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HighlightDTO {
        private String id;
        private String text;
        private Boolean highlighted;
        private Double similarity;
        private String source;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceDTO {
        private String id;
        private String title;
        private String url;
        private String author;
        private Integer year;
        private Double similarity;
        private Integer matchedWords;
    }
} 