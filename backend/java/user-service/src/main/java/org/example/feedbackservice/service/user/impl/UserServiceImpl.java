package org.example.feedbackservice.service.user.impl;

import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.repository.UserRepository;
import org.example.feedbackservice.validation.Validator;
import org.example.feedbackservice.web.requests.UserCreateRequest;
import org.example.feedbackservice.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.example.feedbackservice.web.requests.UserUpdateRequest;
import org.springframework.stereotype.Service;

import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final Validator<UserUpdateRequest> userUpdateValidator;
    private final Validator<UserCreateRequest> userCreateValidator;
    @Override
    public User createUser(UserCreateRequest request) {
        BindingResult bindingResult = new BeanPropertyBindingResult(request, "userCreateRequest");
        userCreateValidator.validate(bindingResult);
        User user = request.toDomain();
        return userRepository.save(user);
    }

    @Override
    public User updateUser(UserUpdateRequest request) {
        BindingResult bindingResult = new BeanPropertyBindingResult(request, "userUpdateRequest");
        userUpdateValidator.validate(bindingResult);
        User updatedUser = request.toDomain();
        return userRepository.save(updatedUser);
    }
}