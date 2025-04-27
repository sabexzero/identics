package org.identics.monolith.web;

import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.dto.notification.NotificationPayload;
import org.identics.monolith.service.notification.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@Slf4j
@Hidden
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationTestController {

    private final NotificationService notificationService;

    @PostMapping("/test/{userId}")
    public ResponseEntity<String> sendTestNotification(@PathVariable Long userId, @RequestBody(required = false) String message) {
        log.info("Sending test notification to user {}", userId);
        
        // Create a test notification payload
        NotificationPayload payload = NotificationPayload.builder()
                .title("Test Notification")
                .message(message != null ? message : "This is a test notification")
                .type("TEST")
                .timestamp(LocalDateTime.now())
                .build();
        
        // Send the notification
        notificationService.sendNotification(userId, payload);
        
        return ResponseEntity.ok("Notification sent to user " + userId);
    }
} 