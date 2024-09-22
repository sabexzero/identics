package org.example.feedbackservice.web.requests;

import org.example.feedbackservice.domain.user.User;

public record Request(
        String name,
        String surname
) {
    public User toDomain() {
        return User.builder()
                .name(name)
                .surname(surname)
                .build();
    }
}
