package org.identics.checkservice.service.auth;

import java.io.IOException;

import lombok.RequiredArgsConstructor;
import org.identics.checkservice.service.auth.providers.JwtAuthProvider;
import org.identics.checkservice.service.auth.providers.keycloak.KeycloakSignInResponse;
import org.identics.checkservice.web.requests.SignInRequest;
import org.identics.checkservice.web.requests.SignUpRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final JwtAuthProvider keyCloakJwtAuthProvider;

    /**
     * Registers a new candidate and adds them to Keycloak.
     * @throws RuntimeException if user creation fails.
     */
    @Override
    public void signUp(SignUpRequest request) {
        try {
            keyCloakJwtAuthProvider.addUser(request.toUserRepresentation());
        } catch (Exception e) {
            throw new RuntimeException("An error occurred during user registration: " + e.getMessage(), e);
        }
    }

    /**
     * Authenticates a user and retrieves an access token.
     * @return KeycloakSignInResponse containing access token, refresh token, and expiration.
     */
    @Override
    public KeycloakSignInResponse signIn(SignInRequest request) throws IOException {
        try {
            return keyCloakJwtAuthProvider.getAccessToken(request);
        } catch (IOException e) {
            throw new IOException("An error occurred during user sign-in: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred during user sign-in: " + e.getMessage(), e);
        }
    }

    /**
     * Refreshes an access token using a refresh token.
     * @param token The refresh token to exchange for a new access token.
     * @return New access token as a string.
     */
    @Override
    public String refreshToken(String token) throws IOException {
        try {
            return keyCloakJwtAuthProvider.refreshAccessToken(token);
        } catch (IOException e) {
            throw new IOException("An error occurred during token refresh: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred during token refresh: " + e.getMessage(), e);
        }
    }

    /**
     * Deactivates a refresh token.
     * @param token The refresh token to deactivate.
     */
    @Override
    public void signOut(String token) throws IOException {
        try {
            keyCloakJwtAuthProvider.deactivateRefreshToken(token);
        } catch (IOException e) {
            throw new IOException("An error occurred during token deactivation: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred during token deactivation: " + e.getMessage(), e);
        }
    }
}
