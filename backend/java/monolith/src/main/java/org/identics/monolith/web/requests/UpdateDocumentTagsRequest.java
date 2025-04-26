package org.identics.monolith.web.requests;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record UpdateDocumentTagsRequest(
    @NotNull(message = "Список тегов не может быть null!")
    List<Long> tagIds
) {
}
