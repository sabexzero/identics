package org.example.feedbackservice.web.requests;

import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.domain.user.UserType;
import org.example.feedbackservice.domain.geo.City;
import org.example.feedbackservice.domain.geo.EducationalOrganization;
import java.util.Optional;

public record UserUpdateRequest(
        Long id,

        String name,
        String surname,
        String patronymic,

        City city,
        EducationalOrganization educationalOrganization,

        UserType type
) {
    public User toDomain() {
        User.UserBuilder builder = User.builder()
                .id(id);
        Optional.ofNullable(name).ifPresent(builder::name);
        Optional.ofNullable(surname).ifPresent(builder::surname);
        Optional.ofNullable(patronymic).ifPresent(builder::patronymic);
        Optional.ofNullable(city).ifPresent(builder::city);
        Optional.ofNullable(educationalOrganization).ifPresent(builder::educationalOrganization);
        Optional.ofNullable(type).ifPresent(builder::type);
        return builder.build();
    }
}
