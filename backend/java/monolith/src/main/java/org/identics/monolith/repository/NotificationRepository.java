package org.identics.monolith.repository;

import org.identics.monolith.domain.notification.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    /**
     * Find all notifications for a specific user, ordered by creation date (newest first)
     */
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    /**
     * Find all unread notifications for a specific user
     */
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(Long userId);
    
    /**
     * Mark all notifications for a user as read
     */
    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.userId = :userId AND n.read = false")
    int markAllAsReadForUser(Long userId);
    
    /**
     * Count unread notifications for a user
     */
    long countByUserIdAndReadFalse(Long userId);
} 