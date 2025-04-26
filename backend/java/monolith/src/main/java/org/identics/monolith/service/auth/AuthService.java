package org.identics.monolith.service.auth;

import java.io.IOException;
import javax.naming.AuthenticationException;
import org.identics.monolith.web.requests.auth.SignInRequest;
import org.identics.monolith.web.requests.auth.UserRegistrationRequest;
import org.identics.monolith.web.responses.auth.SignInKeycloakResponse;

public interface AuthService {
    SignInKeycloakResponse signIn(SignInRequest request) throws AuthenticationException;
    String refreshToken(String refreshToken) throws AuthenticationException;
    void signout(String token) throws AuthenticationException, IOException;
    
    /**
     * Registers a new user in KeyCloak and creates their local profile
     * 
     * @param request Registration details
     * @return Authentication response containing tokens
     * @throws AuthenticationException If registration fails
     */
    SignInKeycloakResponse register(UserRegistrationRequest request) throws AuthenticationException, IOException;
}
