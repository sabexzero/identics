package org.example.feedbackservice.validation.annotationsValidators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.example.feedbackservice.validation.annotations.UserExists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.example.feedbackservice.repository.UserRepository;

@Component
public class UserExistsValidator implements ConstraintValidator<UserExists, Long> {

    private final UserRepository userRepository;

    @Autowired
    public UserExistsValidator(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean isValid(Long userId, ConstraintValidatorContext context) {
        if (userId == null) {
            return true;
        }
        return userRepository.existsById(userId);
    }
}