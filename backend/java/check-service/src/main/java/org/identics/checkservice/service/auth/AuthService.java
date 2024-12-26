package org.identics.checkservice.service.auth;

import org.identics.checkservice.service.auth.providers.keycloak.KeycloakSignInResponse;
import org.identics.checkservice.web.requests.SignInRequest;
import org.identics.checkservice.web.requests.SignUpRequest;

import java.io.IOException;

/**
 * The motivation for implementing this service on top of JWT Provider
 * is the potential opportunity of changing the authorization provider and
 * in addition to the possible desire to perform other operations around JWT-related methods.
 *
 * An example is the creation of a user when registering in the database.
 */
interface AuthService {
    void signUp(SignUpRequest request);
    KeycloakSignInResponse signIn(SignInRequest request) throws IOException;
    String refreshToken(String token) throws IOException;
    void signOut(String token) throws IOException;
}
