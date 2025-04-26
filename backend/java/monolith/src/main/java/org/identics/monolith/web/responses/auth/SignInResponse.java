package org.identics.monolith.web.responses.auth;

import lombok.Builder;

@Builder
public record SignInResponse(
        String accessToken,
        Long expiresIn
) {
}
