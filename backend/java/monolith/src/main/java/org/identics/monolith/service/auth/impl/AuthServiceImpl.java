package org.identics.monolith.service.auth.impl;

import java.io.IOException;
import javax.naming.AuthenticationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.identics.monolith.service.UserService;
import org.identics.monolith.service.auth.AuthService;
import org.identics.monolith.service.auth.JwtAuthProvider;
import org.identics.monolith.web.requests.auth.SignInRequest;
import org.identics.monolith.web.requests.auth.UserRegistrationRequest;
import org.identics.monolith.web.responses.auth.SignInKeycloakResponse;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {
    private final JwtAuthProvider jwtAuthProvider;
    private final UserService userService;

    @Override
    public SignInKeycloakResponse signIn(SignInRequest request) throws AuthenticationException {
        try {
            log.info("Attempting to authenticate user: {}", request.login());
            SignInKeycloakResponse response = jwtAuthProvider.getAccessToken(request);
            log.info("User '{}' successfully authenticated", request.login());
            return response;
        } catch (IOException e) {
            log.error("IO error during user sign-in for user '{}': {}", request.login(), e.getMessage());
            throw new AuthenticationException("An error occurred during user sign-in: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during user sign-in for user '{}': {}", request.login(), e.getMessage());
            throw new RuntimeException("An unexpected error occurred during user sign-in: " + e.getMessage());
        }
    }

    @Override
    public String refreshToken(String token) throws AuthenticationException {
        try {
            log.info("Attempting to refresh token");
            String newAccessToken = jwtAuthProvider.refreshAccessToken(token);
            log.info("Token refresh successful");
            return newAccessToken;
        } catch (IOException e) {
            log.error("IO error during token refresh: {}", e.getMessage(), e);
            throw new AuthenticationException("An error occurred during token refresh: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during token refresh: {}", e.getMessage(), e);
            throw new RuntimeException("An unexpected error occurred during token refresh: " + e.getMessage());
        }
    }

    @Override
    public void signout(String token) throws IOException {
        try {
            log.info("Attempting to deactivate refresh token");
            jwtAuthProvider.deactivateRefreshToken(token);
            log.info("Refresh token deactivated successfully");
        } catch (IOException e) {
            log.error("IO error during token deactivation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during token deactivation: {}", e.getMessage());
            throw e;
        }
    }
    
    @Override
    @Transactional
    public SignInKeycloakResponse register(UserRegistrationRequest request) throws AuthenticationException, IOException {
        try {
            log.info("Starting registration process for user: {}", request.getUsername());
            
            // Step 1: Register the user in KeyCloak and get auth tokens
            SignInKeycloakResponse response = jwtAuthProvider.registerUser(request);
            log.info("User '{}' successfully registered in KeyCloak", request.getUsername());
            
            // Step 2: Create the user in our database along with default settings
            userService.createUser(request);
            log.info("User '{}' successfully created in local database", request.getUsername());
            
            return response;
        } catch (IOException e) {
            log.error("IO error during user registration for '{}': {}", request.getUsername(), e.getMessage());
            throw new AuthenticationException("An error occurred during user registration: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during user registration for '{}': {}", request.getUsername(), e.getMessage());
            throw new RuntimeException("An unexpected error occurred during user registration: " + e.getMessage());
        }
    }
}