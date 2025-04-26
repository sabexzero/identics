package org.identics.monolith.web.requests.auth;

import jakarta.validation.constraints.NotNull;

public record SignInRequest(
    @NotNull(message = "Login must be not null!")
    String login,

    @NotNull(message = "Password must be not null!")
    String password
) {
}
