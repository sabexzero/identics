package org.identics.monolith.repository;

import org.identics.monolith.domain.check.Check;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CheckRepository extends JpaRepository<Check, Long> {
    List<Check> findByIdIn(List<Long> ids);
    Optional<Check> findFirstByContentIdOrderByIdDesc(Long contentId);
    void deleteByContentId(Long contentId);
    Optional<Check> findByContentId(Long contentId);
}
