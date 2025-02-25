package org.identics.checkservice.web.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SignInRequest(
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Must be a valid email address")
    String email,

    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,30}$")
    @NotBlank(message = "Password cannot be blank")
    String password
) { }
