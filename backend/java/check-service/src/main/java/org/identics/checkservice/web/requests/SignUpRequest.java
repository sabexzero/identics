package org.identics.checkservice.web.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;

public class SignUpRequest {
    @Email(message = "Email must be valid")
    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,30}$")
    private String password;

    public UserRepresentation toUserRepresentation() {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(email);
        user.setEnabled(true);
        user.setEmail(email);

        CredentialRepresentation passwordCredential = new CredentialRepresentation();
        passwordCredential.setTemporary(false);
        passwordCredential.setType(CredentialRepresentation.PASSWORD);
        passwordCredential.setValue(password);

        user.setCredentials(List.of(passwordCredential));

        return user;
    }
}