package org.example.feedbackservice.repository;

import org.example.feedbackservice.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
