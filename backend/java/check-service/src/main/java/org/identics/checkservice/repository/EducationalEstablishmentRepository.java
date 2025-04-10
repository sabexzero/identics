package org.identics.checkservice.repository;

import org.identics.checkservice.domain.user.City;
import org.identics.checkservice.domain.user.EducationalEstablishment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EducationalEstablishmentRepository extends MongoRepository<EducationalEstablishment, String> {
    List<EducationalEstablishment> findByTitleContains(String seq, Pageable pageable);
}
