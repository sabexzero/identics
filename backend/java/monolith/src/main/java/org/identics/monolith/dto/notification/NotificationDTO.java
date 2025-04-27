package org.identics.monolith.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.identics.monolith.domain.notification.Notification;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private String title;
    private String message;
    private String type;
    private Long documentId;
    private LocalDateTime createdAt;
    private boolean read;
    
    public static NotificationDTO fromEntity(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .documentId(notification.getDocumentId())
                .createdAt(notification.getCreatedAt())
                .read(notification.isRead())
                .build();
    }
} 