package org.identics.monolith.repository;

import org.identics.monolith.domain.apikey.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
    List<ApiKey> findByUserId(Long userId);
    Optional<ApiKey> findByKeyValue(String keyValue);
    Optional<ApiKey> findByKeyValueAndEnabledTrue(String keyValue);
    boolean existsByKeyValue(String keyValue);
} 