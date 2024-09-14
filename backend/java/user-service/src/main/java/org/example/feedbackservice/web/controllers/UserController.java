package org.example.feedbackservice.web.controllers;

import org.example.feedbackservice.domain.user.User;
import org.example.feedbackservice.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.example.feedbackservice.web.requests.UserCreateRequest;
import org.example.feedbackservice.web.requests.UserUpdateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserCreateRequest request) {
        User createdUser = userService.createUser(request);
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping
    public ResponseEntity<?> updateUser(@RequestBody UserUpdateRequest request) {
        User updateUser = userService.updateUser(request);
        return ResponseEntity.ok(updateUser);
    }
}