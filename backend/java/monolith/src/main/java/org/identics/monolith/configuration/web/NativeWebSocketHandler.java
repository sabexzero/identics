package org.identics.monolith.configuration.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.dto.notification.NotificationPayload;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class NativeWebSocketHandler extends TextWebSocketHandler {
    
    private final ObjectMapper objectMapper;
    
    // Store active sessions by userId
    private final Map<Long, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        Long userId = getUserIdFromSession(session);
        if (userId != null) {
            log.info("WebSocket connection established for user {}", userId);
            userSessions.put(userId, session);
        } else {
            log.warn("WebSocket connection without valid userId, closing");
            try {
                session.close(CloseStatus.POLICY_VIOLATION);
            } catch (IOException e) {
                log.error("Error closing invalid session", e);
            }
        }
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Long userId = getUserIdFromSession(session);
        if (userId != null) {
            log.info("WebSocket connection closed for user {}: {}", userId, status);
            userSessions.remove(userId);
        }
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        Long userId = getUserIdFromSession(session);
        if (userId != null) {
            log.debug("Received message from user {}: {}", userId, message.getPayload());
            // Here you can implement handling of incoming messages if needed
        }
    }
    
    /**
     * Send a notification to a specific user via their WebSocket connection
     * 
     * @param userId The user ID to send the notification to
     * @param payload The notification payload
     * @return true if the notification was sent, false otherwise
     */
    public boolean sendNotificationToUser(Long userId, NotificationPayload payload) {
        WebSocketSession session = userSessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(payload)));
                log.info("Native WebSocket notification sent to user {}", userId);
                return true;
            } catch (IOException e) {
                log.error("Error sending notification to user {}", userId, e);
            }
        } else {
            log.debug("No active WebSocket session for user {}", userId);
        }
        return false;
    }
    
    private Long getUserIdFromSession(WebSocketSession session) {
        // Get userId from session attributes (set by the handshake interceptor)
        Object userIdAttr = session.getAttributes().get("userId");
        if (userIdAttr instanceof Long) {
            return (Long) userIdAttr;
        }
        
        log.warn("No userId found in WebSocket session attributes: {}", session.getId());
        return null;
    }
} 