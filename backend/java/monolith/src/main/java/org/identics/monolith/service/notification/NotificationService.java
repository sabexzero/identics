package org.identics.monolith.service.notification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.domain.notification.Notification;
import org.identics.monolith.dto.notification.NotificationDTO;
import org.identics.monolith.dto.notification.NotificationPayload;
import org.identics.monolith.repository.NotificationRepository;
import org.identics.monolith.web.responses.ApiListResponse;
import org.identics.monolith.web.responses.TagResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final List<NotificationChannel> notificationChannels;
    private final NotificationRepository notificationRepository;

    /**
     * Отправляет уведомление по всем доступным и настроенным для пользователя каналам
     * и сохраняет его в базу данных
     */
    @Transactional
    public void sendNotification(Long userId, NotificationPayload payload) {
        log.info("Sending notification to user {} via all enabled channels", userId);
        
        // Create and save notification entity
        Notification notification = Notification.builder()
                .userId(userId)
                .title(payload.getTitle())
                .message(payload.getMessage())
                .type(payload.getType())
                .documentId(payload.getDocumentId())
                .build();
        
        notification = notificationRepository.save(notification);
        
        // Set ID in payload before sending
        payload.setId(notification.getId());
        
        // Send notification to all channels
        for (NotificationChannel channel : notificationChannels) {
            try {
                if (channel.isEnabled(userId)) {
                    channel.sendNotification(userId, payload);
                }
            } catch (Exception e) {
                log.error("Failed to send notification via channel {}", 
                          channel.getClass().getSimpleName(), e);
            }
        }
    }
    
    /**
     * Создает и отправляет уведомление о завершении проверки
     */
    @Transactional
    public void sendCheckCompletedNotification(Long userId, Long documentId, String title) {
        NotificationPayload payload = NotificationPayload.forCheckCompleted(documentId, title);
        sendNotification(userId, payload);
    }
    
    /**
     * Получает все уведомления пользователя
     */
    @Transactional(readOnly = true)
    public ApiListResponse<NotificationDTO> getAllNotifications(Long userId) {
        return ApiListResponse.<NotificationDTO> builder()
            .items(
                notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                    .map(NotificationDTO::fromEntity)
                    .collect(Collectors.toList())
            ).build();
    }
    
    /**
     * Получает все непрочитанные уведомления пользователя
     */
    @Transactional(readOnly = true)
    public ApiListResponse<NotificationDTO> getUnreadNotifications(Long userId) {
        return ApiListResponse.<NotificationDTO> builder()
            .items(
                notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId).stream()
                    .map(NotificationDTO::fromEntity)
                    .collect(Collectors.toList())
            ).build();
    }
    
    /**
     * Отмечает уведомление как прочитанное
     */
    @Transactional
    public boolean markAsRead(Long notificationId, Long userId) {
        return notificationRepository.findById(notificationId)
                .filter(notification -> notification.getUserId().equals(userId))
                .map(notification -> {
                    notification.setRead(true);
                    notificationRepository.save(notification);
                    return true;
                })
                .orElse(false);
    }
    
    /**
     * Отмечает все уведомления пользователя как прочитанные
     */
    @Transactional
    public int markAllAsRead(Long userId) {
        return notificationRepository.markAllAsReadForUser(userId);
    }
    
    /**
     * Получает количество непрочитанных уведомлений пользователя
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }
} 