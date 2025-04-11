package org.identics.monolith.repository;

import org.identics.monolith.domain.tag.DocumentTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentTagRepository extends JpaRepository<DocumentTag, Long> {
    List<DocumentTag> findByDocumentId(Long documentId);
    List<DocumentTag> findByTagId(Long tagId);
    void deleteByDocumentIdAndTagId(Long documentId, Long tagId);
    void deleteByDocumentId(Long documentId);
    
    @Query("SELECT dt.documentId FROM DocumentTag dt WHERE dt.tagId IN :tagIds GROUP BY dt.documentId HAVING COUNT(dt.tagId) = :tagsCount")
    List<Long> findDocumentIdsByAllTagIds(List<Long> tagIds, long tagsCount);
} 