package org.identics.checkservice.repository;

import org.identics.checkservice.domain.user.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}
