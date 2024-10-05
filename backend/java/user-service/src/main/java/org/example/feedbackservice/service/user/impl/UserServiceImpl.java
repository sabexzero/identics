package org.example.feedbackservice.service.user.impl;

import org.example.feedbackservice.validation.Defect;
import org.example.feedbackservice.validation.ValidationException;
import org.example.feedbackservice.validation.defects.UserDefects;
import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.repository.UserRepository;
import org.example.feedbackservice.web.requests.UserCreateRequest;
import org.example.feedbackservice.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.example.feedbackservice.web.requests.UserUpdateRequest;
import org.springframework.stereotype.Service;

import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final Validator validator;
    @Override
    public User createUser(UserCreateRequest request) {
        User user = request.toDomain();
        return userRepository.save(user);
    }

    @Override
    public User updateUser(@Valid UserUpdateRequest request) {
        BindingResult bindingResult = new BeanPropertyBindingResult(request, "userUpdateRequest");
        validator.validate(request, bindingResult);

        if (bindingResult.hasErrors()) {
            List<Defect> defects = new ArrayList<>();
            defects.add(new Defect("userUpdateRequest", UserDefects.USER_NOT_EXIST));

            throw new ValidationException(defects);
        }

        User updatedUser = request.toDomain();
        return userRepository.save(updatedUser);
    }
}