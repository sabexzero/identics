package org.identics.monolith.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.tag.DocumentTag;
import org.identics.monolith.domain.tag.Tag;
import org.identics.monolith.web.responses.TagResponse;
import org.identics.monolith.repository.DocumentTagRepository;
import org.identics.monolith.repository.TagRepository;
import org.identics.monolith.web.requests.CreateTagRequest;
import org.identics.monolith.web.requests.UpdateTagRequest;
import org.identics.monolith.web.responses.ApiListResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;
    private final DocumentTagRepository documentTagRepository;

    public ApiListResponse<TagResponse> getUserTags(Long userId) {
        return ApiListResponse.<TagResponse> builder()
            .items(
                tagRepository.findByUserId(userId).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList())
            )
            .build();
    }

    @Transactional
    public TagResponse createTag(Long userId, CreateTagRequest request) {
        if (tagRepository.existsByNameAndUserId(request.getName(), userId)) {
            throw new IllegalArgumentException("Tag with this name already exists for user");
        }

        Tag tag = Tag.builder()
            .name(request.getName())
            .hexString(request.getHexString())
            .userId(userId)
            .isDefaultTag(false)
            .build();

        return mapToDto(tagRepository.save(tag));
    }

    @Transactional
    public TagResponse updateTag(Long tagId, UpdateTagRequest request) {
        Tag tag = tagRepository.findById(tagId)
            .orElseThrow(() -> new IllegalArgumentException("Tag does not exist with id=" + tagId));

        return mapToDto(tagRepository.save(
            tag.toBuilder()
                .hexString(request.getHexString())
                .name(request.getName())
                .build()
        ));
    }

    @Transactional
    public void deleteTag(Long tagId) {
        if (!tagRepository.existsById(tagId)) {
            throw new IllegalArgumentException("Tag does not exist with id=" + tagId);
        }

        // Удаляем связи с документами
        documentTagRepository.deleteByTagId(tagId);

        // Удаляем сам тег
        tagRepository.deleteById(tagId);
    }

    @Transactional
    public void assignTagsToDocument(Long documentId, List<Long> tagIds) {
        // Сначала удаляем все существующие теги для документа
        List<DocumentTag> existing = documentTagRepository.findByDocumentId(documentId);
        documentTagRepository.deleteAll(existing);

        // Затем добавляем новые связи
        List<DocumentTag> newTags = tagIds.stream()
            .map(tagId -> DocumentTag.builder()
                .documentId(documentId)
                .tagId(tagId)
                .build())
            .collect(Collectors.toList());

        documentTagRepository.saveAll(newTags);
    }

    public List<TagResponse> getDocumentTags(Long documentId) {
        List<Long> tagIds = documentTagRepository.findByDocumentId(documentId).stream()
            .map(DocumentTag::getTagId)
            .collect(Collectors.toList());

        return tagRepository.findAllById(tagIds).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    public List<Long> findDocumentsByTags(List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return List.of();
        }

        return documentTagRepository.findDocumentIdsByAllTagIds(tagIds, tagIds.size());
    }

    public org.identics.monolith.web.responses.TagResponse getTag(Long tagId) {
        Tag tag = tagRepository.findById(tagId)
            .orElseThrow(() -> new IllegalArgumentException("Tag does not exist with id=" + tagId));

        return mapToTagResponse(tag);
    }

    private TagResponse mapToDto(Tag tag) {
        return TagResponse.builder()
            .id(tag.getId())
            .name(tag.getName())
            .hexString(tag.getHexString())
            .build();
    }

    private TagResponse mapToTagResponse(Tag tag) {
        return org.identics.monolith.web.responses.TagResponse.builder()
            .id(tag.getId())
            .name(tag.getName())
            .hexString(tag.getHexString())
            .build();
    }
} 