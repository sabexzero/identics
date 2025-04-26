package org.identics.monolith.repository;

import org.identics.monolith.domain.check.DocumentSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentSourceRepository extends JpaRepository<DocumentSource, Long> {
    List<DocumentSource> findByCheck_Id(Long checkId);
    void deleteByCheck_ContentId(Long checkId);
} 