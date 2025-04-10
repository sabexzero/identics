package org.identics.checkservice.service.auth.providers.keycloak;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.identics.checkservice.service.auth.providers.JwtAuthProvider;
import org.identics.checkservice.web.requests.SignInRequest;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.List;

/**
 * Service for handling Keycloak authentication and user management.
 */
@Component
@RequiredArgsConstructor
public class KeycloakJwtAuthProvider implements JwtAuthProvider {
    private final Keycloak adminKeycloakClient;
    private final String clientUrl = "localhost:8080/realms/identics-realm/protocol/openid-connect/";
    private final String clientId = "identics-client";
    private final String clientSecret = "Crc6QL2gnI1KBDSgt9s8d7c3ZuWtXMxj";
    private final String realm = "identics-realm";

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    private final String tokenEndpoint = "token";
    private final String logoutEndpoint = "logout";

    private final HttpHeaders headers = new HttpHeaders();

    @Override
    public void addUser(UserRepresentation user) {
        try {
            Response response = adminKeycloakClient
                    .realms()
                    .realm(realm)
                    .users()
                    .create(user);

            if (response.getStatus() != 201) {
                throw new RuntimeException("Failed to create user: " + response.getStatusInfo().getReasonPhrase());
            }
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while creating the user: " + e.getMessage(), e);
        }
    }

    @Override
    public KeycloakSignInResponse getAccessToken(SignInRequest request) throws IOException {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("grant_type", "password");
        body.add("username", request.email());
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
            if (responseBody == null) throw new IOException("Empty response body");

            var jsonNode = objectMapper.readTree(responseBody);

            return new KeycloakSignInResponse(
                    jsonNode.get("access_token").asText(),
                    jsonNode.get("refresh_token").asText(),
                    jsonNode.get("expires_in").asLong()
            );
        } catch (HttpClientErrorException e) {
            throw new IOException("Client error occurred while retrieving access token: " + e.getMessage(), e);
        } catch (HttpServerErrorException e) {
            throw new IOException("Server error occurred while retrieving access token: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new IOException("An unexpected error occurred while retrieving access token: " + e.getMessage(), e);
        }
    }

    @Override
    public String refreshAccessToken(String token) throws IOException {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
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
            if (responseBody == null) throw new IOException("Empty response body");

            var jsonNode = objectMapper.readTree(responseBody);
            return jsonNode.get("access_token").asText();
        } catch (HttpClientErrorException e) {
            throw new IOException("Client error occurred while refreshing access token: " + e.getMessage(), e);
        } catch (HttpServerErrorException e) {
            throw new IOException("Server error occurred while refreshing access token: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new IOException("An unexpected error occurred while refreshing access token: " + e.getMessage(), e);
        }
    }

    @Override
    public void deactivateRefreshToken(String token) throws IOException {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
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
        } catch (HttpClientErrorException e) {
            throw new IOException("Client error occurred while deactivating refresh token: " + e.getMessage(), e);
        } catch (HttpServerErrorException e) {
            throw new IOException("Server error occurred while deactivating refresh token: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new IOException("An unexpected error occurred while deactivating refresh token: " + e.getMessage(), e);
        }
    }

    @Override
    public void grant(String userId, List<String> roles) {
        try {
            var realmResource = adminKeycloakClient.realm(realm);
            var userResource = realmResource.users().get(userId);
            var roleRepresentations = roles.stream()
                    .map(roleName -> realmResource.roles().get(roleName).toRepresentation())
                    .toList();
            userResource.roles().realmLevel().add(roleRepresentations);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while granting roles: " + e.getMessage(), e);
        }
    }

    @Override
    public void revoke(String userId, List<String> roles) {
        try {
            var realmResource = adminKeycloakClient.realm(realm);
            var userResource = realmResource.users().get(userId);
            var roleRepresentations = roles.stream()
                    .map(roleName -> realmResource.roles().get(roleName).toRepresentation())
                    .toList();
            userResource.roles().realmLevel().remove(roleRepresentations);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while revoking roles: " + e.getMessage(), e);
        }
    }
}
