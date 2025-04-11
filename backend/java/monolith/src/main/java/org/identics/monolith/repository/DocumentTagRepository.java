package org.identics.monolith.repository;

import org.identics.monolith.domain.tag.DocumentTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentTagRepository extends JpaRepository<DocumentTag, Long> {
    List<DocumentTag> findByDocumentId(Long documentId);
    List<DocumentTag> findByTagId(Long tagId);
    void deleteByDocumentIdAndTagId(Long documentId, Long tagId);
    void deleteByDocumentId(Long documentId);
    void deleteByTagId(Long tagId);
    
    long countByTagId(Long tagId);
    
    @Query(value = "SELECT dt.document_id FROM document_tag_relation dt " +
            "WHERE dt.tag_id IN :tagIds " +
            "GROUP BY dt.document_id " +
            "HAVING COUNT(DISTINCT dt.tag_id) = :tagsCount", 
           nativeQuery = true)
    List<Long> findDocumentIdsByAllTagIds(@Param("tagIds") List<Long> tagIds, @Param("tagsCount") int tagsCount);
} 