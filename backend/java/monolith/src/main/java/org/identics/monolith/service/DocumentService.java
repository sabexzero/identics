package org.identics.monolith.service;

import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.check.Check;
import org.identics.monolith.domain.check.CheckContent;
import org.identics.monolith.repository.CheckContentRepository;
import org.identics.monolith.repository.CheckRepository;
import org.identics.monolith.web.requests.UpdateDocumentRequest;
import org.identics.monolith.web.responses.DocumentWithTagsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final CheckContentRepository contentRepository;
    private final CheckRepository checkRepository;
    private final TagService tagService;

    public Page<DocumentWithTagsResponse> getUserDocuments(
        Long userId,
        List<Long> tagIds,
        int page,
        int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        // Если есть фильтр по тегам, сначала находим документы, соответствующие этим тегам
        if (tagIds != null && !tagIds.isEmpty()) {
            List<Long> documentIds = tagService.findDocumentsByTags(tagIds);
            if (documentIds.isEmpty()) {
                return Page.empty(pageable);
            }

            // Получаем контент с учетом найденных документов
            return contentRepository.findByUserIdAndIdIn(userId, documentIds, pageable)
                .map(this::mapToDocumentResponse);
        } else {
            // Получаем все документы пользователя в указанной папке
            return contentRepository.findByUserId(userId, pageable)
                .map(this::mapToDocumentResponse);
        }
    }

    public DocumentWithTagsResponse getDocument(Long documentId) {
        CheckContent content = contentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        return mapToDocumentResponse(content);
    }

    @Transactional
    public DocumentWithTagsResponse updateDocument(Long documentId, UpdateDocumentRequest request) {
        CheckContent content = contentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        // Обновление названия документа
        if (!Objects.equals(request.getTitle(), content.getTitle())) {
            contentRepository.save(
                content.toBuilder()
                    .title(request.getTitle())
                    .build()
            );
        }

        // Обновление тегов документа
        if (request.getTagIds() != null) {
            tagService.assignTagsToDocument(documentId, request.getTagIds());
        }

        return mapToDocumentResponse(content);
    }

    @Transactional
    public void deleteDocument(Long documentId) {
        // Сначала удаляем связи с тегами
        tagService.assignTagsToDocument(documentId, Collections.emptyList());

        // Затем удаляем проверки
        checkRepository.deleteByContentId(documentId);

        // Наконец удаляем сам документ
        contentRepository.deleteById(documentId);
    }

    private DocumentWithTagsResponse mapToDocumentResponse(CheckContent content) {
        // Получаем информацию о проверке
        Optional<Check> check = checkRepository.findFirstByContentIdOrderByIdDesc(content.getId());

        return DocumentWithTagsResponse.builder()
            .id(content.getId())
            .title(content.getTitle())
            .userId(content.getUserId())
            .folderId(content.getFolderId())
            .checkDate(check.map(Check::getDateTime).orElse(null))
            .plagiarismLevel(check.map(Check::getPlagiarismLevel).orElse(null))
            .aiCheckLevel(check.map(Check::getAiCheckLevel).orElse(null))
            .tags(tagService.getDocumentTags(content.getId()))
            .build();
    }
} 