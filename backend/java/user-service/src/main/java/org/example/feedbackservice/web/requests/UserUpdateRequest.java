package org.example.feedbackservice.web.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.domain.user.UserType;
import org.example.feedbackservice.domain.geo.City;
import org.example.feedbackservice.domain.geo.EducationalOrganization;
import org.example.feedbackservice.validation.annotations.ForbiddenChars;
import org.example.feedbackservice.validation.annotations.UserExists;

public record UserUpdateRequest(
        @UserExists
        Long id,
        @ForbiddenChars
        @NotBlank
        @Size(min = 2, max = 50)
        String name,
        @ForbiddenChars
        @NotBlank
        @Size(min = 2, max = 50)
        String surname,
        @ForbiddenChars
        @Size(max = 50)
        String patronymic,
        City city,
        EducationalOrganization educationalOrganization,
        @NotBlank
        UserType type
) {
    public User toDomain() {
        return  User.builder()
                .id(id)
                .name(name)
                .surname(surname)
                .patronymic(patronymic)
                .city(city)
                .educationalOrganization(educationalOrganization)
                .type(type)
                .build();
    }
}
