package org.example.feedbackservice.domain.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.example.feedbackservice.domain.geo.City;
import org.example.feedbackservice.domain.geo.EducationalOrganization;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    private String patronymic;
    private City city;
    private EducationalOrganization educationalOrganization;
    private UserType type;
}
