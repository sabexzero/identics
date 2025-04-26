package org.identics.monolith.service.auth;

import java.io.IOException;
import org.identics.monolith.web.requests.auth.SignInRequest;
import org.identics.monolith.web.requests.auth.UserRegistrationRequest;
import org.identics.monolith.web.responses.auth.SignInKeycloakResponse;

public interface JwtAuthProvider {
    SignInKeycloakResponse getAccessToken(SignInRequest request) throws IOException;
    String refreshAccessToken(String token) throws IOException;
    void deactivateRefreshToken(String token) throws IOException;
    
    /**
     * Registers a new user in KeyCloak and returns authentication tokens
     * 
     * @param request Registration details
     * @return Authentication response with tokens
     * @throws IOException If registration fails
     */
    SignInKeycloakResponse registerUser(UserRegistrationRequest request) throws IOException;
}
