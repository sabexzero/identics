package org.example.feedbackservice.validation;

public record Defect(
        String path,
        DefectId defectId
) {

}