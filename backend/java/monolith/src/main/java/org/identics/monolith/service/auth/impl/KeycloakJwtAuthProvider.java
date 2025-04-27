package org.identics.monolith.service.auth.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import lombok.Builder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.identics.monolith.service.auth.JwtAuthProvider;
import org.identics.monolith.web.requests.auth.SignInRequest;
import org.identics.monolith.web.requests.auth.UserRegistrationRequest;
import org.identics.monolith.web.responses.auth.SignInKeycloakResponse;

@Builder
public class KeycloakJwtAuthProvider implements JwtAuthProvider {
    private final String clientUrl;
    private final String clientId;
    private final String clientSecret;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    private final String tokenEndpoint = "token";
    private final String logoutEndpoint = "logout";
    private final String usersEndpoint = "users";

    private final String registerUrl = "https://keycloak.identics.tech/admin/realms/textsource-realm/users";

    private final HttpHeaders headers;

    @Override
    public SignInKeycloakResponse getAccessToken(SignInRequest request) throws IOException {
        MultiValueMap<String,String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("grant_type", "password");
        body.add("username", request.login());
        body.add("password", request.password());

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                clientUrl + tokenEndpoint,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new IOException("Failed to retrieve access token: " + response.getStatusCode());
            }

            String responseBody = response.getBody();
            if (responseBody == null) {
                throw new IOException("Empty response body");
            }

            JsonNode jsonNode = objectMapper.readTree(responseBody);

            return SignInKeycloakResponse.builder()
                .accessToken(jsonNode.get("access_token").asText())
                .refreshToken(jsonNode.get("refresh_token").asText())
                .expiresIn(jsonNode.get("expires_in").asLong())
                .build();
        } catch (HttpClientErrorException e) {
            throw new IOException("Client error occurred while retrieving access token: " + e.getMessage());
        } catch (HttpServerErrorException e) {
            throw new IOException("Server error occurred while retrieving access token: " + e.getMessage());
        } catch (Exception e) {
            throw new IOException("An unexpected error occurred while retrieving access token: " + e.getMessage());
        }
    }

    @Override
    public String refreshAccessToken(String token) throws IOException {
        MultiValueMap<String,String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("grant_type", "refresh_token");
        body.add("refresh_token", token);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                clientUrl + tokenEndpoint,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new IOException("Failed to refresh access token: " + response.getStatusCode());
            }

            String responseBody = response.getBody();
            if (responseBody == null) {
                throw new IOException("Empty response body");
            }

            JsonNode jsonNode = objectMapper.readTree(responseBody);
            return jsonNode.get("access_token").asText();
        } catch (HttpClientErrorException e) {
            throw new IOException("Client error occurred while refreshing access token: " + e.getMessage());
        } catch (HttpServerErrorException e) {
            throw new IOException("Server error occurred while refreshing access token: " + e.getMessage());
        } catch (Exception e) {
            throw new IOException("An unexpected error occurred while refreshing access token: " + e.getMessage());
        }
    }

    @Override
    public void deactivateRefreshToken(String token) throws IOException {
        MultiValueMap<String,String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("refresh_token", token);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                clientUrl + logoutEndpoint,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new IOException("Failed to deactivate refresh token: " + response.getStatusCode());
            }
        } catch (HttpClientErrorException exception){
            throw new IOException("Client error occurred while deactivating refresh token: " + exception.getMessage());
        } catch(HttpServerErrorException exception){
            throw new IOException("Server error occurred while deactivating refresh token: " + exception.getMessage());
        } catch(Exception exception){
            throw new IOException("An unexpected error occurred while deactivating refresh token: " + exception.getMessage());
        }
    }
    
    @Override
    public SignInKeycloakResponse registerUser(UserRegistrationRequest request, Long userId) throws IOException {
        // Step 1: First get admin access token to create the user
        String adminToken = getAdminToken();
        
        // Step 2: Create user in KeyCloak
        createKeycloakUser(adminToken, request, userId);
        
        // Step 3: Get user tokens by logging in
        SignInRequest signInRequest = new SignInRequest(request.getEmail(), request.getPassword());
        return getAccessToken(signInRequest);
    }
    
    private String getAdminToken() throws IOException {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("grant_type", "client_credentials");
        
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                clientUrl + tokenEndpoint,
                HttpMethod.POST,
                new HttpEntity<>(body, headers),
                String.class
            );
            
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new IOException("Failed to get admin token: " + response.getStatusCode());
            }
            
            String responseBody = response.getBody();
            if (responseBody == null) {
                throw new IOException("Empty response body");
            }
            
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            return jsonNode.get("access_token").asText();
        } catch (Exception e) {
            throw new IOException("Error getting admin token: " + e.getMessage(), e);
        }
    }

    private void createKeycloakUser(String adminToken, UserRegistrationRequest request, Long userId) throws IOException {
        // Prepare headers with authorization
        HttpHeaders adminHeaders = new HttpHeaders();
        adminHeaders.setContentType(MediaType.APPLICATION_JSON);
        adminHeaders.set("Authorization", "Bearer " + adminToken);

        // Prepare user representation
        Map<String, Object> userRepresentation = new HashMap<>();
        userRepresentation.put("username", request.getEmail());
        userRepresentation.put("email", request.getEmail());
        userRepresentation.put("enabled", true);
        userRepresentation.put("firstName", request.getName());
        userRepresentation.put("lastName", request.getName());
        userRepresentation.put("emailVerified", true);

        // Add user_id attribute
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("user_id", userId);

        if (request.getCity() != null) {
            attributes.put("city", request.getCity());
        }
        if (request.getInstitution() != null) {
            attributes.put("institution", request.getInstitution());
        }
        userRepresentation.put("attributes", attributes);

        // Add credentials in requested format
        Map<String, Object> credential = new HashMap<>();
        credential.put("type", "password");
        credential.put("value", request.getPassword());
        credential.put("temporary", false);
        userRepresentation.put("credentials", Collections.singletonList(credential));

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                registerUrl,
                HttpMethod.POST,
                new HttpEntity<>(userRepresentation, adminHeaders),
                String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new IOException("Failed to create user: " + response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            throw new IOException("Client error creating user: " + e.getMessage() + ", Response: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new IOException("Error creating KeyCloak user: " + e.getMessage(), e);
        }
    }
}
