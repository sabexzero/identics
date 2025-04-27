package org.identics.monolith.repository;

import java.util.Optional;
import org.identics.monolith.domain.check.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    Page<Document> findByUserId(Long userId, Pageable pageable);
    Page<Document> findByUserIdAndIdIn(Long userId, List<Long> ids, Pageable pageable);
    
    @Query("SELECT d FROM Document d WHERE d.userId = :userId AND " +
           "(:searchTerm IS NULL OR LOWER(d.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "CAST(d.id AS string) LIKE CONCAT('%', :searchTerm, '%'))")
    Page<Document> searchByUserIdAndTitleOrId(@Param("userId") Long userId, 
                                              @Param("searchTerm") String searchTerm,
                                              Pageable pageable);
}
