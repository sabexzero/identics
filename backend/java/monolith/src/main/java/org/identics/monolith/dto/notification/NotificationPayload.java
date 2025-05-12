package org.identics.monolith.dto.notification;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationPayload {
    private Long id;
    private String title;
    private String message;
    private String type; // CHECK_COMPLETED, SYSTEM, etc.
    private LocalDateTime createdAt;
    private Boolean read;

    // Дополнительные поля для разных типов уведомлений
    private Long documentId;

    public static NotificationPayload forCheckCompleted(Long documentId, String title) {
        return NotificationPayload.builder()
            .title("Проверка завершена")
            .message("Проверка документа под названием \"" + title + "\" завершена!")
            .type("CHECK_COMPLETED")
            .documentId(documentId)
            .createdAt(LocalDateTime.now())
            .read(false)
            .build();
    }
} 