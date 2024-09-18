package org.example.feedbackservice.web.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.domain.user.UserType;
import org.example.feedbackservice.domain.geo.City;
import org.example.feedbackservice.domain.geo.EducationalOrganization;
import java.util.Optional;

public record UserUpdateRequest(
        Long id,
        @NotBlank
        @Size(min = 2, max = 50)
        String name,
        @NotBlank
        @Size(min = 2, max = 50)
        String surname,
        @Size(max = 50)
        String patronymic,

        City city,
        EducationalOrganization educationalOrganization,
        @NotBlank
        String userType
) {
    public User toDomain() {
        User.UserBuilder builder = User.builder()
                .id(id);
        Optional.ofNullable(name).ifPresent(builder::name);
        Optional.ofNullable(surname).ifPresent(builder::surname);
        Optional.ofNullable(patronymic).ifPresent(builder::patronymic);
        Optional.ofNullable(city).ifPresent(builder::city);
        Optional.ofNullable(educationalOrganization).ifPresent(builder::educationalOrganization);
        Optional.ofNullable(userType).ifPresent(type -> {
            try {
                UserType userTypeEnum = UserType.valueOf(type.toUpperCase());
                builder.type(userTypeEnum);
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid user type: " + type);
            }
        });
        return builder.build();
    }
}
