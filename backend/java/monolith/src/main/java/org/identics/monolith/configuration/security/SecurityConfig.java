package org.identics.monolith.configuration.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.configuration.security.keycloak.KeycloakInitializerConfigurationProperties;
import org.identics.monolith.web.dto.ErrorResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final KeycloakInitializerConfigurationProperties keycloakProperties;
    private final ObjectMapper objectMapper;

    // Create a separate security chain for WebSockets with highest order
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityFilterChain websocketSecurityFilterChain(HttpSecurity http) throws Exception {
        http
            .securityMatcher("/ws/**", "/api/ws/**") // Apply this configuration only to WebSocket endpoints
            .csrf(AbstractHttpConfigurer::disable)
            .cors(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        
        return http.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // API auth endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/notifications/test/**").permitAll()
                .requestMatchers(
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll()// Allow test endpoint
                
                // All other requests need authentication
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(resourceServer ->
                resourceServer
                    .jwt(jwt ->
                        jwt.jwtAuthenticationConverter(jwtAuthenticationConverterForKeycloak())
                    )
                    .bearerTokenResolver(this::customBearerTokenResolver)
                    .authenticationEntryPoint(new CustomAuthenticationEntryPoint(objectMapper))
            )
            .exceptionHandling(exceptions -> exceptions
                .accessDeniedHandler(new CustomAccessDeniedHandler(objectMapper))
            );

        return http.build();
    }

    private String customBearerTokenResolver(HttpServletRequest request) {
        // Ignore token check for WebSocket connections
        String path = request.getRequestURI();
        if (path.startsWith("/ws") || path.startsWith("/api/ws")) {
            return null;
        }
        
        // Ignore token check for refresh and login endpoints
        if (request.getRequestURI().endsWith("/refresh-token") || request.getRequestURI().endsWith("/login") || request.getRequestURI().endsWith("/signout")) {
            return null;
        }

        // Standard token extraction logic
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverterForKeycloak() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();

        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Map<String,Object> resourceAccess = jwt.getClaim("resource_access");
            Map<String,List<String>> client = (Map<String,List<String>>) resourceAccess.get(
                keycloakProperties.getClientId()
            );

            List<String> clientRoles = client != null ? client.get("roles") : Collections.emptyList();

            return clientRoles.stream()
                .map(role -> "ROLE_" + role)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        });

        return jwtAuthenticationConverter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:63342","http://127.0.0.1:8080", "https://textsource.ru"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PATCH","PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    // Custom authentication entry point for JSON responses
    @RequiredArgsConstructor
    private static class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
        private final ObjectMapper objectMapper;
        
        @Override
        public void commence(HttpServletRequest request, HttpServletResponse response, 
                            AuthenticationException authException) throws IOException, ServletException {
            log.warn("Authentication failed for path: {}", request.getRequestURI());
            
            // Не логгировать стектрейс для путей к /error, чтобы избежать дублирования логов
            if (!request.getRequestURI().equals("/error")) {
                log.debug("Authentication exception details: ", authException);
            }
            
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            
            ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.UNAUTHORIZED.value())
                .error(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                .message("Для доступа к данному ресурсу требуется аутентификация")
                .path(request.getRequestURI())
                .build();
            
            objectMapper.writeValue(response.getOutputStream(), errorResponse);
        }
    }
    
    // Custom access denied handler for JSON responses
    @RequiredArgsConstructor
    private static class CustomAccessDeniedHandler implements AccessDeniedHandler {
        private final ObjectMapper objectMapper;
        
        @Override
        public void handle(HttpServletRequest request, HttpServletResponse response,
                          AccessDeniedException accessDeniedException) throws IOException, ServletException {
            log.warn("Access denied for path: {}", request.getRequestURI());
            log.debug("Access denied details: ", accessDeniedException);
            
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            
            ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .error(HttpStatus.FORBIDDEN.getReasonPhrase())
                .message("У вас нет прав для доступа к данному ресурсу")
                .path(request.getRequestURI())
                .build();
            
            objectMapper.writeValue(response.getOutputStream(), errorResponse);
        }
    }
}