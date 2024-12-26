package org.identics.checkservice.service.educ.impl;

import lombok.RequiredArgsConstructor;
import org.identics.checkservice.domain.user.EducationalEstablishment;
import org.identics.checkservice.repository.EducationalEstablishmentRepository;
import org.identics.checkservice.service.educ.EducationalEstablishmentService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationalEstablishmentServiceImpl implements EducationalEstablishmentService {
    private final EducationalEstablishmentRepository establishmentRepository;

    @Override
    public List<String> getAll(String seq) {
        Pageable pageable = PageRequest.of(0, 15);
        return establishmentRepository.findByTitleContains(seq, pageable)
            .stream()
            .map(EducationalEstablishment::getTitle)
            .toList();
    }
}
