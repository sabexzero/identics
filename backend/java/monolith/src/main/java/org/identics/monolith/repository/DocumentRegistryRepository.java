package org.identics.monolith.repository;

import java.util.UUID;
import org.identics.monolith.domain.check.DocumentRegistry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentRegistryRepository extends JpaRepository<DocumentRegistry,UUID> {
}
