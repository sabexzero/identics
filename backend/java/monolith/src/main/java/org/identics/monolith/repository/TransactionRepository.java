package org.identics.monolith.repository;

import org.identics.monolith.domain.transaction.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findByUserIdOrderByDateTimeDesc(Long userId, Pageable pageable);
} 