package org.identics.monolith.web.responses.auth;

import lombok.Builder;

@Builder
public record SignInKeycloakResponse(
        String accessToken,
        String refreshToken,
        Long expiresIn
) {
}
