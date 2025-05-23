package org.identics.checkservice.web.controllers;

import lombok.RequiredArgsConstructor;
import org.identics.checkservice.service.check.CheckService;
import org.identics.checkservice.web.requests.CheckRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/checks")
public class CheckController {
    private final CheckService checkService;

    @PostMapping
    public ResponseEntity<?> check(
        @RequestBody
        CheckRequest request
    ) {
        try {
            checkService.check(request);
            return ResponseEntity
                .ok()
                .build();
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .body(e.getLocalizedMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> get(
        @RequestParam
        String userId,
        @RequestParam
        int page,
        @RequestParam
        int size
    ) {
        try {
            return ResponseEntity
                .ok()
                .body(checkService.getAll(userId, page, size));
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .body(e.getLocalizedMessage());
        }
    }
}
