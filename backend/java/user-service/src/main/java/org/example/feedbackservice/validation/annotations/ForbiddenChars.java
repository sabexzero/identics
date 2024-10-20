package org.example.feedbackservice.validation.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.example.feedbackservice.validation.annotationsValidators.ForbidenCharsValidator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = ForbidenCharsValidator.class)
@Target({ ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ForbiddenChars {
    String message() default "CONTAINS_FORBIDDEN_CHARACTERS";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
