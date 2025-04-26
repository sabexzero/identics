package org.identics.monolith.configuration.security.keycloak;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.identics.monolith.service.auth.JwtAuthProvider;
import org.identics.monolith.service.auth.impl.KeycloakJwtAuthProvider;

@Configuration
public class KeycloakConfig {

    private final KeycloakInitializerConfigurationProperties keycloakProperties;

    public KeycloakConfig(KeycloakInitializerConfigurationProperties keycloakProperties) {
        this.keycloakProperties = keycloakProperties;
    }

    @Bean
    public Keycloak adminKeycloakClient() {
        return KeycloakBuilder.builder()
                .grantType(OAuth2Constants.PASSWORD)
                .realm(keycloakProperties.getMasterRealm())
                .clientId(keycloakProperties.getAdminClientId())
                .username(keycloakProperties.getUsername())
                .password(keycloakProperties.getPassword())
                .serverUrl(keycloakProperties.getAdminUrl())
                .build();
    }

    @Bean
    public JwtAuthProvider keyCloakJwtAuthProvider() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        return KeycloakJwtAuthProvider.builder()
                .headers(headers)
                .clientId(keycloakProperties.getClientId())
                .clientUrl(keycloakProperties.getClientUrl())
                .clientSecret(keycloakProperties.getClientSecret())
                .build();
    }
}

