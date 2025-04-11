package org.identics.monolith.web.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.identics.monolith.domain.check.ContentType;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class UploadContentRequest {
    @NotBlank(message = "Название документа не может быть пустым")
    @Size(max = 255, message = "Название документа не может превышать 255 символов")
    private String title;
    
    @NotBlank(message = "Содержимое документа не может быть пустым")
    @Size(min = 10, message = "Содержимое документа должно содержать минимум 10 символов")
    private String content;
    
    @NotNull(message = "Тип содержимого обязателен")
    private ContentType contentType;

    @NotNull(message = "Список тегов обязателен, даже пустой список!")
    private List<Long> tagIds;
}
