package org.example.feedbackservice.service.user;

import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.web.requests.CreateUserRequest;

public interface UserService {
    User createUser(CreateUserRequest request);
}
