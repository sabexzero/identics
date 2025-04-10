package org.identics.checkservice.web.controllers;

import lombok.RequiredArgsConstructor;
import org.identics.checkservice.service.cities.CityService;
import org.identics.checkservice.service.educ.EducationalEstablishmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Передает необходимую информацию о городах, вузах и тд
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/options")
public class OptionsController {
    private final CityService cityService;
    private final EducationalEstablishmentService educationalEstablishmentService;

    @GetMapping("/cities")
    public ResponseEntity<?> getCities(
        @RequestParam
        String prefix
    ) {
        try {
            return ResponseEntity
                .ok()
                .body(cityService.getCitiesByFirstLetters(prefix));
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .body(e.getLocalizedMessage());
        }
    }

    @GetMapping("/educational")
    public ResponseEntity<?> getEduc(
        @RequestParam
        String sequence
    ) {
        try {
            return ResponseEntity
                .ok()
                .body(cityService.getCitiesByFirstLetters(sequence));
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .body(e.getLocalizedMessage());
        }
    }
}
