package org.identics.monolith.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.tag.DocumentTag;
import org.identics.monolith.domain.tag.Tag;
import org.identics.monolith.dto.TagDTO;
import org.identics.monolith.repository.DocumentTagRepository;
import org.identics.monolith.repository.TagRepository;
import org.identics.monolith.web.requests.CreateTagRequest;
import org.identics.monolith.web.requests.UpdateTagRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagService {
    private final TagRepository tagRepository;
    private final DocumentTagRepository documentTagRepository;
    
    public List<TagDTO> getUserTags(Long userId) {
        return tagRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TagDTO createTag(CreateTagRequest request) {
        // Проверка на дубликаты
        if (tagRepository.existsByNameAndUserId(request.getName(), request.getUserId())) {
            throw new IllegalArgumentException("Tag with this name already exists for user");
        }
        
        Tag tag = Tag.builder()
                .name(request.getName())
                .userId(request.getUserId())
                .build();
        
        return mapToDto(tagRepository.save(tag));
    }

    @Transactional
    public TagDTO updateTag(Long tagId, UpdateTagRequest request) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new IllegalArgumentException("Tag not found"));
        
        tag.setName(request.getName());
        return mapToDto(tagRepository.save(tag));
    }
    
    @Transactional
    public void deleteTag(Long tagId) {
        // Проверка существования тега
        if (!tagRepository.existsById(tagId)) {
            throw new IllegalArgumentException("Tag not found");
        }
        
        // Сначала удаляем все связи с документами
        List<DocumentTag> documentTags = documentTagRepository.findByTagId(tagId);
        documentTagRepository.deleteAll(documentTags);
        
        // Затем удаляем сам тег
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
    
    public List<TagDTO> getDocumentTags(Long documentId) {
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
    
    private TagDTO mapToDto(Tag tag) {
        return TagDTO.builder()
                .id(tag.getId())
                .name(tag.getName())
                .userId(tag.getUserId())
                .build();
    }
} 