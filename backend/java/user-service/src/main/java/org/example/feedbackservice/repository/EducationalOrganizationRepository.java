package org.example.feedbackservice.repository;

import org.example.feedbackservice.domain.geo.EducationalOrganization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationalOrganizationRepository extends JpaRepository<EducationalOrganization, Long> {
}
