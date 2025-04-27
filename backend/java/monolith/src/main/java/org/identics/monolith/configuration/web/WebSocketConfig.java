package org.identics.monolith.configuration.web;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.HandshakeHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

@Slf4j
@Configuration
@EnableWebSocket
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer, WebSocketConfigurer {

    private final NativeWebSocketHandler nativeWebSocketHandler;
    private final WebSocketHandshakeInterceptor handshakeInterceptor;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Enable a simple in-memory message broker for sending messages to clients
        // /queue/ is typically used for point-to-point messaging (user-specific notifications)
        // /topic/ is used for broadcasting (if needed in future)
        registry.enableSimpleBroker("/queue", "/topic");

        // Prefix for client-to-server messages (if used in future)
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the WebSocket endpoint
        // SockJS fallback options are enabled for browsers where WebSockets aren't available
        registry
            .addEndpoint("/ws")
            .setAllowedOrigins("*") // In production, restrict this to specific origins
            .withSockJS();
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        log.info("Registering WebSocket handler for path /api/ws/{userId}");
        
        // Register the native WebSocket handler with path pattern that includes userId
        registry
            .addHandler(nativeWebSocketHandler, "/api/ws/{userId}")
            .addInterceptors(handshakeInterceptor)
            .setAllowedOrigins("*");
    }
    
    @Bean
    public HandshakeHandler handshakeHandler() {
        return new DefaultHandshakeHandler();
    }
}