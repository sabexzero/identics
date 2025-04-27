package org.identics.monolith.service.notification.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.configuration.web.NativeWebSocketHandler;
import org.identics.monolith.domain.user.UserSettings;
import org.identics.monolith.dto.notification.NotificationPayload;
import org.identics.monolith.repository.NotificationRepository;
import org.identics.monolith.repository.UserSettingsRepository;
import org.identics.monolith.service.notification.NotificationChannel;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NativeWebSocketNotificationChannel implements NotificationChannel {
    private final NativeWebSocketHandler nativeWebSocketHandler;
    private final UserSettingsRepository userSettingsRepository;
    private final NotificationRepository notificationRepository;
    
    @Override
    public void sendNotification(Long userId, NotificationPayload payload) {
        try {
            boolean sent = nativeWebSocketHandler.sendNotificationToUser(userId, payload);
            if (sent) {
                log.info("Native WebSocket notification sent to user {}", userId);
            } else {
                log.debug("Failed to send native WebSocket notification to user {} (no active connection)", userId);
            }
        } catch (Exception e) {
            log.error("Error sending native WebSocket notification to user {}", userId, e);
        }
    }

    @Override
    public boolean isEnabled(Long userId) {
        return userSettingsRepository.findByUserId(userId)
            .map(UserSettings::getIsBrowserNotificationsEnabled)
            .orElse(false);
    }
} 