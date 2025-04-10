package org.identics.checkservice.configuration.keycloak;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "keycloak-initializer")
public class KeycloakInitializerConfigurationProperties {
    // Getters and Setters
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
