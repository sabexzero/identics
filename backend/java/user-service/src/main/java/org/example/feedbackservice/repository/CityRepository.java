package org.example.feedbackservice.repository;

import org.example.feedbackservice.domain.geo.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Long> {
}
