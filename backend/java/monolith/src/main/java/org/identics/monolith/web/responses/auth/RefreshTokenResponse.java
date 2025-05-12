package org.identics.monolith.web.responses.auth;

import lombok.Builder;

@Builder(toBuilder = true)
public record RefreshTokenResponse(
    String token,
    Long userId
) {
}
