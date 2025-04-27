package org.identics.monolith.configuration.web;

import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriTemplate;

@Slf4j
@Component
public class WebSocketHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, 
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        String path = request.getURI().getPath();
        log.info("Processing WebSocket handshake for path: {}", path);
        
        // Extract userId from the URI and add it to attributes
        UriTemplate template = new UriTemplate("/api/ws/{userId}");
        Map<String, String> uriVariables = template.match(path);
        
        if (uriVariables != null && uriVariables.containsKey("userId")) {
            String userId = uriVariables.get("userId");
            log.info("Extracted userId from WebSocket path: {}", userId);
            
            try {
                Long userIdValue = Long.parseLong(userId);
                attributes.put("userId", userIdValue);
                log.info("Adding userId={} to WebSocket session attributes", userIdValue);
                return true;
            } catch (NumberFormatException e) {
                log.error("Invalid userId format in WebSocket path: {}", userId, e);
                return false;
            }
        }
        
        log.warn("Could not extract userId from WebSocket path: {}", path);
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, 
                               WebSocketHandler wsHandler, Exception exception) {
        if (exception != null) {
            log.error("Error during WebSocket handshake: {}", exception.getMessage(), exception);
        } else {
            log.info("WebSocket handshake completed successfully for {}", request.getURI());
        }
    }
} 