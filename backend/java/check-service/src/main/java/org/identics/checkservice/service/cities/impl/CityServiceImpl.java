package org.identics.checkservice.service.cities.impl;

import lombok.RequiredArgsConstructor;
import org.identics.checkservice.domain.user.City;
import org.identics.checkservice.repository.CityRepository;
import org.identics.checkservice.service.cities.CityService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityServiceImpl implements CityService {
    private final CityRepository cityRepository;

    @Override
    public List<String> getCitiesByFirstLetters(String firstLetters) {
        Pageable pageable = PageRequest.of(0, 15);
        return cityRepository.findByTitleStartingWith(firstLetters, pageable)
            .stream()
            .map(City::getTitle)
            .toList();
    }
}
