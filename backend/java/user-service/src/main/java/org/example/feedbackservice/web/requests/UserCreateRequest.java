package org.example.feedbackservice.web.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.domain.user.UserType;
import org.example.feedbackservice.domain.geo.City;
import org.example.feedbackservice.domain.geo.EducationalOrganization;

public record UserCreateRequest(
        @NotBlank
        @Size(min = 2, max = 50)
        String name,
        @NotBlank
        @Size(min = 2, max = 50)
        String surname,
        @Size(max = 50)
        String patronymic,
        @NotNull
        City city,
        @NotNull
        EducationalOrganization educationalOrganization,
        @NotNull
        UserType type
) {
    public User toDomain() {
        return User.builder()
                .id(null)
                .name(name)
                .surname(surname)
                .patronymic(patronymic)
                .city(city)
                .educationalOrganization(educationalOrganization)
                .type(type)
                .build();
    }
}
