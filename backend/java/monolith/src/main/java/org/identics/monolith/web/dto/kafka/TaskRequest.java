package org.identics.monolith.web.dto.kafka;

import lombok.Builder;

@Builder
public record TaskRequest(
    String requestId,       // Уникальный ID для этой задачи (генерируется в CheckService)
    Long checkId,       // Уникальный ID для этой задачи (генерируется в CheckService)
    Long userContentId,     // ID документа в нашей БД
    String url,             // URL контента (может быть null для 'plain')
    String contentType      // Новый тип контента: "pdf", "docx", "txt", "plain"
) {}