package org.identics.monolith.service.notification;

import org.identics.monolith.dto.notification.NotificationPayload;

public interface NotificationChannel {
    void sendNotification(Long userId, NotificationPayload payload);
    boolean isEnabled(Long userId);
} 