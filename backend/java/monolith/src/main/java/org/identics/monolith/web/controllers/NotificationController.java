package org.identics.monolith.web.controllers;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.configuration.security.RequiresUserIdMatch;
import org.identics.monolith.dto.notification.NotificationDTO;
import org.identics.monolith.service.notification.NotificationService;
import org.identics.monolith.web.responses.ApiListResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/{userId}/notifications")
@RequiredArgsConstructor
@RequiresUserIdMatch
public class NotificationController {
    private final NotificationService notificationService;

    /**
     * Get all notifications for the current user
     */
    @GetMapping
    public ResponseEntity<ApiListResponse<NotificationDTO>> getAllNotifications(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId
    ) {
        log.info("Getting all notifications for user {}", userId);
        return ResponseEntity.ok(notificationService.getAllNotifications(userId));
    }

    /**
     * Get unread notifications for the current user
     */
    @GetMapping("/unread")
    public ResponseEntity<ApiListResponse<NotificationDTO>> getUnreadNotifications(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId
    ) {
        log.info("Getting unread notifications for user {}", userId);
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    /**
     * Mark a notification as read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
        @PathVariable Long id,
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId
    ) {
        log.info("Marking notification {} as read for user {}", id, userId);
        if (notificationService.markAsRead(id, userId)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Mark all notifications as read
     */
    @PutMapping("/read")
    public ResponseEntity<Integer> markAllAsRead(
        @PathVariable @Parameter(name = "userId", description = "Уникальный идентификатор пользователя") Long userId
    ) {
        log.info("Marking all notifications as read for user {}", userId);
        int count = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(count);
    }
} 