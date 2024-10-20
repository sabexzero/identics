package org.example.feedbackservice.validation.annotationsValidators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.example.feedbackservice.validation.annotations.ForbiddenChars;
import org.springframework.stereotype.Component;

@Component
public class ForbidenCharsValidator implements ConstraintValidator<ForbiddenChars, String> {

    private static final String FORBIDDEN_CHARACTERS = "!@#$%^&*()_+={}[]|:;\"'<>,?/~`";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return true;
        }

        for (int i = 0; i < value.length(); i++) {
            if (FORBIDDEN_CHARACTERS.indexOf(value.charAt(i)) >= 0) {
                return false;
            }
        }
        return true;
    }
}
