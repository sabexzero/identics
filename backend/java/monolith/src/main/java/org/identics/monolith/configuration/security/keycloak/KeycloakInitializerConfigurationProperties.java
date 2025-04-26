package org.identics.monolith.configuration.security.keycloak;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "keycloak-initializer")
public class KeycloakInitializerConfigurationProperties {
    private boolean initializeOnStartup;
    private String masterRealm;
    private String applicationRealm;
    private String clientId;
    private String adminClientId;
    private String clientSecret;
    private String username;
    private String password;
    private String clientUrl;
    private String adminUrl;
    private String realm;
}