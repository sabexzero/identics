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
public class UpdateUserProfileRequest {
    @NotBlank(message = "Имя не может быть пустым")
    @Size(max = 100, message = "Имя не может превышать 100 символов")
    private String name;
    
    @NotBlank(message = "Фамилия не может быть пустой")
    @Size(max = 100, message = "Фамилия не может превышать 100 символов")
    private String surname;
    
    @Size(max = 100, message = "Отчество не может превышать 100 символов")
    private String patronymic;
    
    @NotBlank(message = "Город не может быть пустым")
    @Size(max = 100, message = "Город не может превышать 100 символов")
    private String city;
    
    @NotBlank(message = "Учебное заведение не может быть пустым")
    @Size(max = 255, message = "Название учебного заведения не может превышать 255 символов")
    private String institution;
} 