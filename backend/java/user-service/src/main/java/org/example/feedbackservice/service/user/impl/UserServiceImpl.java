package org.example.feedbackservice.service.user.impl;

import jakarta.persistence.EntityNotFoundException;
import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.repository.UserRepository;
import org.example.feedbackservice.web.requests.UserCreateRequest;
import org.example.feedbackservice.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.example.feedbackservice.web.requests.UserUpdateRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User createUser(UserCreateRequest request) {
        User user = request.toDomain();
        return userRepository.save(user);
    }

    @Override
    public User updateUser(UserUpdateRequest request) {
        User currentUser = userRepository.findById(request.id())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + request.id()));
        User updatedUser = request.toDomain();
        return userRepository.save(updatedUser);
    }
}