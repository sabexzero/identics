package org.identics.monolith.service.content;

import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.check.CheckContent;
import org.identics.monolith.repository.CheckContentRepository;
import org.identics.monolith.web.requests.UploadContentRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CheckContentService {
    private final CheckContentRepository repository;

    public CheckContent uploadContent(
        UploadContentRequest request,
        Long userId,
        Long folderId
    ) {
        return repository.save(
            CheckContent.builder()
                .userId(userId)
                .text(request.getContent())
                .title(request.getTitle())
                .contentType(request.getContentType())
                .folderId(folderId)
                .build()
        );
    }
}
