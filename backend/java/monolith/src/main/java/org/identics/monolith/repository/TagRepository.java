package org.identics.monolith.repository;

import org.identics.monolith.domain.tag.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByUserId(Long userId);
    boolean existsByNameAndUserId(String name, Long userId);
} 