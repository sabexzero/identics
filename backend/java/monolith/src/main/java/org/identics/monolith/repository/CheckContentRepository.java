package org.identics.monolith.repository;

import org.identics.monolith.domain.check.CheckContent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheckContentRepository extends JpaRepository<CheckContent, Long> {
    Page<CheckContent> findByUserId(Long userId, Pageable pageable);
    Page<CheckContent> findByUserIdAndIdIn(Long userId, List<Long> ids, Pageable pageable);
}
