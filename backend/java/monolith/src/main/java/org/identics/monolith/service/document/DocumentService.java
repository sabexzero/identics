package org.identics.monolith.service.document;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.check.Check;
import org.identics.monolith.domain.check.ContentType;
import org.identics.monolith.domain.check.Document;
import org.identics.monolith.domain.check.DocumentRegistry;
import org.identics.monolith.domain.check.DocumentSource;
import org.identics.monolith.repository.CheckRepository;
import org.identics.monolith.repository.DocumentRepository;
import org.identics.monolith.repository.DocumentSourceRepository;
import org.identics.monolith.service.TagService;
import org.identics.monolith.service.s3.S3Service;
import org.identics.monolith.web.requests.UpdateDocumentRequest;
import org.identics.monolith.web.requests.UpdateDocumentTagsRequest;
import org.identics.monolith.web.requests.UploadContentRequest;
import org.identics.monolith.web.responses.ApiListResponse;
import org.identics.monolith.web.responses.DocumentWithTagsResponse;
import org.identics.monolith.web.responses.GetDocumentByIdResponse;
import org.identics.monolith.web.responses.TagResponse;
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
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final CheckRepository checkRepository;
    private final TagService tagService;
    private final DocumentSourceRepository sourceRepository;
    private final S3Service s3Service;

    @Transactional // Добавляем транзакционность
    public Document uploadDocument(UploadContentRequest request, Long userId, MultipartFile file) throws IOException {
        // 1. Определяем Content Type
        String detectedContentType;
        if (file != null && !file.isEmpty()) {
            // Пытаемся определить тип по расширению файла
            String originalFilename = file.getOriginalFilename();
            String extension = StringUtils.getFilenameExtension(originalFilename);
            detectedContentType = mapExtensionToContentType(extension);
        } else if (request.getContentType() != null && request.getContentType().getValue().equalsIgnoreCase("plain")) {
            // Если файл не передан, и тип указан как "plain"
            detectedContentType = "plain";
        } else {
            // Неопределенная ситуация или ошибка
            throw new IllegalArgumentException("Невозможно определить тип контента: файл не предоставлен или тип не 'plain'");
        }

        // 2. Загружаем файл в S3 (только если это не 'plain')
        String fileUrl = null;
        String fileKey = null;
        if (!detectedContentType.equals("plain") && !file.isEmpty()) {
            fileKey = "documents/" + userId + "/" + UUID.randomUUID().toString() + "." + StringUtils.getFilenameExtension(file.getOriginalFilename()); // Пример ключа
            fileUrl = s3Service.uploadDocument(fileKey, file); // Используйте ваш метод S3
        } else if (!detectedContentType.equals("plain")) {
            throw new IllegalArgumentException("Файл обязателен для типа контента '" + detectedContentType + "'");
        }

        ContentType parsedContentType = ContentType.fromValue(detectedContentType);

        if (parsedContentType == null) {
            throw new IllegalArgumentException("Файл имеет недоступный тип контента!");
        }

        // 3. Создаем и сохраняем сущность Document
        Document document = Document.builder()
            .userId(userId)
            .text(request.getContent())
            .title(request.getTitle()) // Берем из реквеста
            .url(fileUrl) // Будет null для 'plain'
            .contentType(parsedContentType) // Устанавливаем определенный тип
            .build();

        Document savedDocument = documentRepository.save(document);

        // 4. Привязываем теги
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            tagService.assignTagsToDocument(savedDocument.getId(), request.getTagIds());
        }

        return savedDocument;
    }

    // Вспомогательный метод для определения типа контента по расширению
    private String mapExtensionToContentType(String extension) {
        if (extension == null) return "unknown"; // Или бросить исключение
        return switch (extension.toLowerCase()) {
            case "pdf" -> "pdf";
            case "docx" -> "docx";
            case "doc" -> "docx"; // Старый формат тоже мапим на docx (если обработчик умеет)
            case "txt" -> "txt";
            default -> "unknown"; // Или другой тип по умолчанию/ошибка
        };
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

    @Transactional(readOnly = true)
    public GetDocumentByIdResponse getDocumentById(Long documentId) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        Check check = checkRepository.findFirstByContentIdOrderByIdDesc(document.getId())
            .orElse(null);

        return GetDocumentByIdResponse.builder()
            .title(document.getTitle())
            .checkDate(check == null ? null : check.getStartTime())
            .wordCount(check == null ? null : check.getWordCount())
            .uniqueness(check == null ? null : check.getUniqueness())
            .aiContent(check == null ? null : check.getAiCheckLevel())
            .processingTime(check == null || check.getEndTime() == null ? 0L : Duration.between(check.getEndTime(), check.getStartTime()).getSeconds())
            .sources(check == null ? null : mapSourcesFromRegistry(sourceRepository.findByCheck_Id(check.getId())))
            .reportUrl(check == null ? null : check.getReportUrl())
            .tags(tagService.getDocumentTags(document.getId()))
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
    public DocumentWithTagsResponse updateDocumentTags(Long documentId, UpdateDocumentTagsRequest request) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        tagService.assignTagsToDocument(documentId, request.tagIds());

        return mapToDocumentResponse(document);
    }

    @Transactional
    public void deleteDocument(Long documentId) {
        // Сначала удаляем связи с тегами
        tagService.assignTagsToDocument(documentId, Collections.emptyList());

        // Удаляем связанные сущности
        sourceRepository.deleteByCheck_ContentId(documentId);

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
            .reportUrl(check.map(Check::getReportUrl).orElse(null))
            .build();
    }

    @Transactional(readOnly = true) // readOnly = true для оптимизации чтения
    protected List<GetDocumentByIdResponse.SourceDTO> mapSourcesFromRegistry(List<DocumentSource> sources) {
        if (sources == null || sources.isEmpty()) {
            return Collections.emptyList();
        }
        return sources.stream()
            .map(s -> {
                // Доступ к sourceDocumentRegistry вызовет его загрузку (если LAZY)
                // Это может привести к проблеме N+1, если источников много.
                // Рассмотрите использование fetch join в запросе репозитория,
                // который получает DocumentSource, чтобы загрузить DocumentRegistry сразу.
                DocumentRegistry registryInfo = s.getSourceDocumentRegistry(); // Получаем связанную сущность

                return GetDocumentByIdResponse.SourceDTO.builder()
                    .sourceInfo(registryInfo != null ? registryInfo.getOriginalFilename().replace(".txt", "").trim() : null)
                    .firstPos(s.getFirstPos())
                    .secondPos(s.getSecondPos())
                    .build();
            })
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

    public ApiListResponse<TagResponse> getDocumentTags(Long documentId) {
        documentRepository.findById(documentId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));

        return ApiListResponse.<TagResponse> builder()
            .items(tagService.getDocumentTags(documentId))
            .build();
    }
}