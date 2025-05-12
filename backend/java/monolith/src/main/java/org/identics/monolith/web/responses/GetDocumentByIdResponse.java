package org.identics.monolith.web.responses;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import org.identics.monolith.web.responses.TagResponse;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetDocumentByIdResponse {
    private String title;
    private LocalDateTime checkDate;
    private Integer wordCount;
    private Double uniqueness;
    private Double aiContent;
    private String reportUrl;

    private Long processingTime;

    private List<SourceDTO> sources;
    private List<TagResponse> tags;


    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SourceDTO { // Переименуем DTO для ясности
        private String sourceInfo;       // Доп. инфо об источнике
        private String sourceUrl;
        private Integer firstPos;         // Позиция начала совпадения в проверяемом документе
        private Integer secondPos;        // Позиция конца совпадения в проверяемом документе
        private String text;              // Текст контекста вокруг совпадения
        private Integer startCharIndex;   // Позиция начала совпадения в символах (не n-граммах)
        private Integer endCharIndex;     // Позиция конца совпадения в символах (не n-граммах)
    }
} 