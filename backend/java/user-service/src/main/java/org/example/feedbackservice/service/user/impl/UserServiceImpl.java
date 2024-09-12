package org.example.feedbackservice.service.user.impl;

import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.repository.UserRepository;
import org.example.feedbackservice.web.requests.CreateUserRequest;
import org.example.feedbackservice.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User createUser(CreateUserRequest request) {
        User user = request.toDomain();
        return userRepository.save(user);
    }
}