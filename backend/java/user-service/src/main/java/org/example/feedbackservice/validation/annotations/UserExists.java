package org.example.feedbackservice.validation.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.example.feedbackservice.validation.annotationsValidators.UserExistsValidator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = UserExistsValidator.class)
@Target({ ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface UserExists {
    String message() default "USER_NOT_EXISTS";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

