package org.identics.monolith.web;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.dto.notification.NotificationPayload;
import org.identics.monolith.service.notification.NotificationService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Slf4j
@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;

    /**
     * This method handles messages sent to /app/send/{userId}
     * It can be used for testing or client-to-server communication
     */
    @MessageMapping("/send/{userId}")
    public void sendToUser(@DestinationVariable Long userId, NotificationPayload payload) {
        log.info("Received message from WebSocket client for user {}: {}", userId, payload);
        notificationService.sendNotification(userId, payload);
    }
    
    /**
     * Helper method to directly send a notification to a specific user via WebSocket
     * This can be called from other services
     */
    public void sendNotification(Long userId, NotificationPayload payload) {
        String destination = "/queue/notifications." + userId;
        messagingTemplate.convertAndSend(destination, payload);
        log.info("Notification sent to user {} at {}", userId, destination);
    }
} 