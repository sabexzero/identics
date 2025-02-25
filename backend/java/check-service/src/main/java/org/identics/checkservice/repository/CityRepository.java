package org.identics.checkservice.repository;

import org.identics.checkservice.domain.user.City;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CityRepository extends MongoRepository<City, String> {
    List<City> findByTitleStartingWith(String prefix, Pageable pageable);
}
