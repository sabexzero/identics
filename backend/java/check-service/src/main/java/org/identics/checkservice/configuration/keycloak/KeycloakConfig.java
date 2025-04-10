package org.identics.checkservice.configuration.keycloak;

import org.identics.checkservice.service.auth.providers.JwtAuthProvider;
import org.identics.checkservice.service.auth.providers.keycloak.KeycloakJwtAuthProvider;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
                .serverUrl("https://" + keycloakProperties.getAdminUrl())
                .build();
    }

    @Bean
    public JwtAuthProvider keyCloakJwtAuthProvider() {
        return new KeycloakJwtAuthProvider(
                adminKeycloakClient()
        );
    }
}