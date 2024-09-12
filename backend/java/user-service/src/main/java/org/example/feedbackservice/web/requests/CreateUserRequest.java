package org.example.feedbackservice.web.requests;

import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.domain.user.UserType;
import org.example.feedbackservice.domain.geo.City;
import org.example.feedbackservice.domain.geo.EducationalOrganization;

public record CreateUserRequest(
        String name,
        String surname,
        String patronymic,

        City city,
        EducationalOrganization educationalOrganization,

        UserType type
) {
    public User toDomain() {
        return User.builder(){
            .name(name)
            .surname(surname)
            .patronymic(patronymic)
            .city(city)
            .educationalOrganization(educationalOrganization)
            .type(type)
            .build();
        }
    }
}