package org.identics.monolith.repository;

import org.identics.monolith.domain.check.DocumentHighlight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentHighlightRepository extends JpaRepository<DocumentHighlight, Long> {
    List<DocumentHighlight> findByDocumentId(Long documentId);
    void deleteByDocumentId(Long documentId);
} 