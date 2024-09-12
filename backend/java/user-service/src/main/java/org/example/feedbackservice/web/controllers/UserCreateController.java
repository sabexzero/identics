package org.example.feedbackservice.web.controllers;

//не знаю как внедрить кафку, поэтому спиздил у гопника контроллер без него, если что пояснишь что там и куда делать, чтобы внедрить сюда кафку

import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.service.user.UserService;
import org.example.feedbackservice.web.requests.CreateUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        User createdUser = userService.createUser(request);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }
}