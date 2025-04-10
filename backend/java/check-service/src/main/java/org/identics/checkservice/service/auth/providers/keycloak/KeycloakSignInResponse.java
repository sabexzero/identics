package org.identics.checkservice.service.auth.providers.keycloak;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KeycloakSignInResponse {
    private String token;
    private String refreshToken;
    private Long expiresIn;
}
