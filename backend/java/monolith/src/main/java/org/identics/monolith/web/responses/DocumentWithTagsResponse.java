package org.identics.monolith.web.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.identics.monolith.dto.TagDTO;

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
    private Long folderId;
    private LocalDateTime checkDate;
    private Double plagiarismLevel;
    private Integer aiCheckLevel;
    private List<TagDTO> tags;
} 