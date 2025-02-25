package org.identics.checkservice.service.auth.providers;

import org.identics.checkservice.service.auth.providers.keycloak.KeycloakSignInResponse;
import org.identics.checkservice.web.requests.SignInRequest;
import org.keycloak.representations.idm.UserRepresentation;

import java.io.IOException;
import java.util.List;

public interface JwtAuthProvider {
    void addUser(UserRepresentation user);
    KeycloakSignInResponse getAccessToken(SignInRequest request) throws IOException;
    String refreshAccessToken(String token) throws IOException;
    void deactivateRefreshToken(String token) throws IOException;
    void grant(String userId, List<String> roles);
    void revoke(String userId, List<String> roles);
}
