package org.identics.monolith.web.controllers.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import java.io.IOException;
import java.time.Duration;
import java.util.Base64;
import javax.naming.AuthenticationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.identics.monolith.service.auth.AuthService;
import org.identics.monolith.web.requests.auth.SignInRequest;
import org.identics.monolith.web.requests.auth.UserRegistrationRequest;
import org.identics.monolith.web.responses.auth.RefreshTokenResponse;
import org.identics.monolith.web.responses.auth.SignInKeycloakResponse;
import org.identics.monolith.web.responses.auth.SignInResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    private final ObjectMapper objectMapper;

    private Long extractUserIdFromToken(String accessToken) {
        try {
            // JWT token consists of three parts: header.payload.signature
            String[] parts = accessToken.split("\\.");
            if (parts.length != 3) {
                log.warn("Invalid JWT token format");
                return null;
            }
            
            // Decode the payload (second part)
            String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
            JsonNode jsonNode = objectMapper.readTree(payload);
            
            // Try to extract userId from different claims
            if (jsonNode.has("userId")) {
                return jsonNode.get("userId").asLong();
            } else if (jsonNode.has("user_id")) {
                return jsonNode.get("user_id").asLong();
            }
            
            log.warn("JWT token does not contain userId or user_id claim");
            return null;
        } catch (Exception e) {
            log.error("Error extracting userId from token: {}", e.getMessage());
            return null;
        }
    }

    @PostMapping("/login")
    @Operation(
        summary = "Login user",
        description = "Authenticates a user and retrieves an access token"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "User authenticated successfully",
            content = @Content(schema = @Schema(implementation = SignInResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request",
            content = @Content(schema = @Schema(implementation = String.class))
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(schema = @Schema(implementation = String.class))
        )
    })
    public ResponseEntity<?> loginUser(
        @Valid
        @RequestBody
        SignInRequest request
    ) {
        try {
            // Аутентификация пользователя
            SignInKeycloakResponse authResponse = authService.signIn(request);

            // Создание куки для refresh token
            ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", authResponse.refreshToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .partitioned(true)
                .maxAge(Duration.ofDays(1000))
                .build();
                
            // Extract userId from the access token
            Long userId = extractUserIdFromToken(authResponse.accessToken());

            // Формирование тела ответа
            SignInResponse responseBody = SignInResponse.builder()
                .userId(userId)
                .accessToken(authResponse.accessToken())
                .expiresIn(authResponse.expiresIn())
                .build();

            // Возвращение ответа с куками и телом
            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(responseBody);

        } catch (AuthenticationException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid request: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An unexpected error occurred: " + e.getMessage());
        }
    }
    
    @PostMapping("/register")
    @Operation(
        summary = "Register a new user",
        description = "Registers a new user in the system and returns an access token"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "User registered successfully",
            content = @Content(schema = @Schema(implementation = SignInResponse.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid registration data",
            content = @Content(schema = @Schema(implementation = String.class))
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(schema = @Schema(implementation = String.class))
        )
    })
    public ResponseEntity<?> registerUser(
        @Valid
        @RequestBody
        UserRegistrationRequest request
    ) {
        try {
            log.info("Received registration request for user: {}", request.getEmail());
            
            // Register the user and get authentication response
            SignInKeycloakResponse authResponse = authService.register(request);
            
            // Create cookie for refresh token
            ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", authResponse.refreshToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .partitioned(true)
                .maxAge(Duration.ofDays(1000))
                .build();
            
            // Extract userId from the access token
            Long userId = extractUserIdFromToken(authResponse.accessToken());
                
            // Create response body
            SignInResponse responseBody = SignInResponse.builder()
                .userId(userId)
                .accessToken(authResponse.accessToken())
                .expiresIn(authResponse.expiresIn())
                .build();
                
            log.info("User '{}' successfully registered", request.getEmail());
            
            // Return response with cookie and body
            return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(responseBody);
                
        } catch (AuthenticationException e) {
            log.error("Registration failed for '{}': {}", request.getEmail(), e.getMessage());
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Invalid registration request: " + e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error during registration for '{}': {}", request.getEmail(), e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An unexpected error occurred during registration: " + e.getMessage());
        }
    }

    @PostMapping("/refresh-token")
    @Operation(
        summary = "Refresh access token",
        description = "Refreshes an access token using a refresh token"
    )
    @ApiResponses({
        @ApiResponse(
            responseCode = "200",
            description = "Token refreshed successfully",
            content = @Content(schema = @Schema(implementation = String.class))
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid request",
            content = @Content(schema = @Schema(implementation = String.class))
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = @Content(schema = @Schema(implementation = String.class))
        )
    })
    public ResponseEntity<RefreshTokenResponse> refreshToken(
        @CookieValue("refresh_token") String token
    ) throws AuthenticationException {
        String newToken = authService.refreshToken(token);
        
        // Extract userId from the access token
        Long userId = extractUserIdFromToken(newToken);
        
        return ResponseEntity.ok(
            RefreshTokenResponse.builder()
                .token(newToken)
                .userId(userId)
                .build()
        );
    }

    @PostMapping("/signout")
    @Operation(
        summary = "Sign out user",
        description = """
        Deactivates a refresh token to sign out the user.
        """
    )
    public ResponseEntity<?> signOut(
        @CookieValue(value = "refresh_token", required = false) String token
    ) {
        log.info("Received request to sign out user.");

        // Проверяем, что токен существует
        if (token == null || token.isEmpty()) {
            log.warn("No refresh token found in cookies.");
            return ResponseEntity.badRequest().body("Refresh token is missing");
        }

        try {
            authService.signout(token);
            log.info("User signed out successfully.");
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException exception) {
            log.warn("Invalid request: {}", exception.getMessage());
            return ResponseEntity.badRequest().body("Invalid request");
        } catch (IOException exception) {
            log.error("I/O error during sign out: {}", exception.getMessage());
            return ResponseEntity.internalServerError().body("I/O error: " + exception.getLocalizedMessage());
        } catch (Exception exception) {
            log.error("Unexpected error during sign out: {}", exception.getMessage());
            return ResponseEntity.internalServerError().body("An unexpected error occurred");
        }
    }
}
