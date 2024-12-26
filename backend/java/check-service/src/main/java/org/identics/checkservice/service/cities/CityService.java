package org.identics.checkservice.service.cities;

import java.util.List;

public interface CityService {
    List<String> getCitiesByFirstLetters(String firstLetters);
}
