package org.example.feedbackservice.validation;

import com.netflix.config.validation.ValidationException;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;

import java.util.ArrayList;
import java.util.List;

@Component
public class Validator {
    private String fieldName;
    private final List<Validator> subResults = new ArrayList<>();
    private final List<DefectId> errors = new ArrayList<>();

    public Validator() {}

    public Validator check(boolean checkResult, DefectId defectId) {
        if (!checkResult) {
            errors.add(defectId);
        }
        return this;
    }

    public <I> Validator item(I fieldValue, String fieldName) {
        Validator validator = new Validator();
        subResults.add(validator);
        return validator;
    }

    private List<Defect> getAllErrors() {
        List<Defect> resultList = new ArrayList<>();
        for (DefectId defectId : errors) {
            resultList.add(new Defect(fieldName, defectId));
        }
        for (Validator subValidator : subResults) {
            List<Defect> subErrors = subValidator.getAllErrors();
            for (Defect defect : subErrors) {
                if (!fieldName.isEmpty()) {
                    resultList.add(new Defect(fieldName + "." + defect.path(), defect.defectId()));
                } else {
                    resultList.add(defect);
                }
            }
        }
        return resultList;
    }

    public void validate() {
        List<Defect> errors = getAllErrors();
        if (!errors.isEmpty()) {
            throw new ValidationException(String.valueOf(errors));
        }
    }

    public void validate(BindingResult bindingResult) {
        List<ObjectError> errors = bindingResult.getAllErrors();
        if (!errors.isEmpty()) {
            throw new ValidationException(String.valueOf(errors));
        }
    }
}