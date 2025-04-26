package org.identics.monolith.web.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import org.identics.monolith.domain.check.Check;
import org.identics.monolith.domain.check.ContentType;
import org.identics.monolith.domain.kafka.CheckRequestMessage;

@Builder
public record CheckRequest(
    @NotNull(message = "ID контента обязателен для проверки")
    Long contentId,

    @NotNull(message = "Необходимо указать, требуется ли проверка на AI-генерацию")
    Boolean isAiCheck,

    @NotNull(message = "Необходимо указать, требуется ли проверка на плагиат")
    Boolean isPlagiarismCheck,

    String contentUrl,

    @NotBlank(message = "Необходимо указать тип контента (pdf, docx, txt, plain)")
    ContentType contentType, // Новый тип контента

    String kafkaRequestId // Опционально: для трассировки или логирования
) {
    public Check toDomain() {
        return Check.builder()
            .id(null)
            .contentId(contentId)
            .build();
    }
}
