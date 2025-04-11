package org.identics.monolith.web.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateApiKeyRequest {
    @NotBlank(message = "Название ключа не может быть пустым")
    @Size(max = 100, message = "Название ключа не может превышать 100 символов")
    private String name;
} 