package org.example.feedbackservice.service.user;

import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.web.requests.UserCreateRequest;
import org.example.feedbackservice.web.requests.UserUpdateRequest;

public interface UserService {
    User createUser(UserCreateRequest request);
    User updateUser(UserUpdateRequest request);
}
