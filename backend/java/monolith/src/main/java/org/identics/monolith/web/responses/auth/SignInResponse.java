package org.identics.monolith.web.responses.auth;

import lombok.Builder;

@Builder
public record SignInResponse(
    Long userId,
    String accessToken,
    Long expiresIn
) {
}
