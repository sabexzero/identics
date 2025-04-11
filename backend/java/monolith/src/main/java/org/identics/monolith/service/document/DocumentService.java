package org.identics.monolith.service.document;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.check.Check;
import org.identics.monolith.domain.check.Document;
import org.identics.monolith.domain.check.DocumentHighlight;
import org.identics.monolith.domain.check.DocumentSource;
import org.identics.monolith.repository.CheckRepository;
import org.identics.monolith.repository.DocumentRepository;
import org.identics.monolith.repository.DocumentHighlightRepository;
import org.identics.monolith.repository.DocumentSourceRepository;
import org.identics.monolith.service.TagService;
import org.identics.monolith.web.requests.UpdateDocumentRequest;
import org.identics.monolith.web.requests.UploadContentRequest;
import org.identics.monolith.web.responses.DocumentWithTagsResponse;
import org.identics.monolith.web.responses.GetDocumentByIdResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final CheckRepository checkRepository;
    private final TagService tagService;
    private final DocumentHighlightRepository highlightRepository;
    private final DocumentSourceRepository sourceRepository;

    public Document uploadDocument(
        UploadContentRequest request,
        Long userId
    ) {
        // Создаем новый документ
        Document document = Document.builder()
            .userId(userId)
            .title(request.getTitle())
            .contentType(request.getContentType())
            .text(request.getContent())
            .build();

        Document savedDocument = documentRepository.save(document);

        // Если есть теги, привязываем их к документу
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            tagService.assignTagsToDocument(savedDocument.getId(), request.getTagIds());
        }

        return savedDocument;
    }

    public Page<DocumentWithTagsResponse> getUserDocuments(
        Long userId,
        List<Long> tagIds,
        String searchTerm,
        String sortBy,
        String sortDirection,
        int page,
        int size
    ) {
        Sort sort = createSort(sortBy, sortDirection);
        Pageable pageable = PageRequest.of(page, size, sort);

        if ((tagIds != null && !tagIds.isEmpty()) || (searchTerm != null && !searchTerm.trim().isEmpty())) {
            final List<Long> documentIds = (tagIds != null && !tagIds.isEmpty())
                ? tagService.findDocumentsByTags(tagIds)
                : Collections.emptyList();

            if (searchTerm != null && !searchTerm.trim().isEmpty()) {
                // Fetch all matching documents (without tag filtering first)
                Page<DocumentWithTagsResponse> searchResults = documentRepository
                    .searchByUserIdAndTitleOrId(userId, searchTerm, pageable)
                    .map(this::mapToDocumentResponse);

                // Apply tag filtering if needed
                if (!documentIds.isEmpty()) {
                    List<DocumentWithTagsResponse> filteredContent = searchResults.getContent()
                        .stream()
                        .filter(doc -> documentIds.contains(doc.getId()))
                        .collect(Collectors.toList());

                    return new PageImpl<>(
                        filteredContent,
                        pageable,
                        filteredContent.size()
                    );
                } else {
                    return searchResults;
                }
            } else if (!documentIds.isEmpty()) {
                // Only tag filtering
                return documentRepository.findByUserIdAndIdIn(userId, documentIds, pageable)
                    .map(this::mapToDocumentResponse);
            }
        }

        // No filters, return all user documents
        return documentRepository.findByUserId(userId, pageable)
            .map(this::mapToDocumentResponse);
    }

    public GetDocumentByIdResponse getDocumentById(Long documentId) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));
            
        Check check = checkRepository.findFirstByContentIdOrderByIdDesc(document.getId())
            .orElse(null);
        
        List<DocumentHighlight> highlights = highlightRepository.findByDocumentId(documentId);
        List<DocumentSource> sources = sourceRepository.findByDocumentId(documentId);
        
        return GetDocumentByIdResponse.builder()
            .title(document.getTitle())
            .checkDate(check == null ? null : check.getStartTime())
            .wordCount(check == null ? null : check.getWordCount())
            .uniqueness(check == null ? null : check.getUniqueness())
            .aiContent(check == null ? null : check.getAiCheckLevel())
            .processingTime(check == null ? 0L : Duration.between(LocalDateTime.now(), check.getEndTime()).getSeconds())
            .highlights(mapHighlights(highlights))
            .sources(mapSources(sources))
            .build();
    }

    @Transactional
    public DocumentWithTagsResponse updateDocument(Long documentId, UpdateDocumentRequest request) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        // Обновление названия документа
        if (!Objects.equals(request.getTitle(), document.getTitle())) {
            documentRepository.save(
                document.toBuilder()
                    .title(request.getTitle())
                    .build()
            );
        }

        // Обновление тегов документа
        if (request.getTagIds() != null) {
            tagService.assignTagsToDocument(documentId, request.getTagIds());
        }

        return mapToDocumentResponse(document);
    }

    @Transactional
    public void deleteDocument(Long documentId) {
        // Сначала удаляем связи с тегами
        tagService.assignTagsToDocument(documentId, Collections.emptyList());
        
        // Удаляем связанные сущности
        highlightRepository.deleteByDocumentId(documentId);
        sourceRepository.deleteByDocumentId(documentId);

        // Затем удаляем проверки
        checkRepository.deleteByContentId(documentId);

        // Наконец удаляем сам документ
        documentRepository.deleteById(documentId);
    }

    private DocumentWithTagsResponse mapToDocumentResponse(Document document) {
        // Получаем информацию о проверке
        Optional<Check> check = checkRepository.findFirstByContentIdOrderByIdDesc(document.getId());

        return DocumentWithTagsResponse.builder()
            .id(document.getId())
            .title(document.getTitle())
            .userId(document.getUserId())
            .checkDate(check.map(Check::getStartTime).orElse(null))
            .uniqueness(check.map(Check::getUniqueness).orElse(null))
            .aiLevel(check.map(Check::getAiCheckLevel).orElse(null))
            .tags(tagService.getDocumentTags(document.getId()))
            .build();
    }
    
    private List<GetDocumentByIdResponse.HighlightDTO> mapHighlights(List<DocumentHighlight> highlights) {
        return highlights.stream()
            .map(h -> GetDocumentByIdResponse.HighlightDTO.builder()
                .id(h.getId().toString())
                .text(h.getText())
                .highlighted(h.getHighlighted())
                .similarity(h.getSimilarity())
                .source(h.getSource())
                .build())
            .collect(Collectors.toList());
    }
    
    private List<GetDocumentByIdResponse.SourceDTO> mapSources(List<DocumentSource> sources) {
        return sources.stream()
            .map(s -> GetDocumentByIdResponse.SourceDTO.builder()
                .id(s.getId().toString())
                .title(s.getTitle())
                .url(s.getUrl())
                .author(s.getAuthor())
                .year(s.getYear())
                .similarity(s.getSimilarity())
                .matchedWords(s.getMatchedWords())
                .build())
            .collect(Collectors.toList());
    }
    
    private Sort createSort(String sortBy, String sortDirection) {
        Sort.Direction direction = sortDirection != null && sortDirection.equalsIgnoreCase("asc") 
            ? Sort.Direction.ASC 
            : Sort.Direction.DESC;
            
        if (sortBy == null || sortBy.trim().isEmpty()) {
            return Sort.by(direction, "id");
        }

        return switch (sortBy.toLowerCase()) {
            case "title" -> Sort.by(direction, "title");
            case "date" -> Sort.by(direction, "processingTime");
            default -> Sort.by(direction, "id");
        };
    }
} 