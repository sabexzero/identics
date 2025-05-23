package org.identics.monolith.web.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTagRequest {
    @NotBlank(message = "Название тега не может быть пустым")
    @Size(min = 1, max = 50, message = "Название тега должно содержать от 1 до 50 символов")
    private String name;

    @NotBlank(message = "HEX-строка цвета тега не может быть пустой")
    private String hexString;
} 