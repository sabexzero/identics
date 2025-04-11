package org.identics.monolith.web.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDocumentRequest {
    @NotBlank(message = "Название документа не может быть пустым")
    @Size(max = 255, message = "Название документа не может превышать 255 символов")
    private String title;
    
    private List<Long> tagIds;
} 