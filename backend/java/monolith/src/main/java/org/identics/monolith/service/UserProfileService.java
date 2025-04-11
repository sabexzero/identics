package org.identics.monolith.service;

import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.user.User;
import org.identics.monolith.dto.UserProfileDTO;
import org.identics.monolith.repository.UserRepository;
import org.identics.monolith.web.requests.UpdateUserProfileRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserRepository userRepository;
    
    public UserProfileDTO getUserProfile(Long userId) {
        return userRepository.findById(userId)
                .map(this::mapToDto)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
    
    public UserProfileDTO updateUserProfile(Long userId, UpdateUserProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setPatronymic(request.getPatronymic());
        user.setCity(request.getCity());
        user.setInstitution(request.getInstitution());
        
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public void addChecksToUser(Long userId, Integer checksCount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Integer currentChecks = user.getChecksAvailable() != null ? user.getChecksAvailable() : 0;
        user.setChecksAvailable(currentChecks + checksCount);
        
        userRepository.save(user);
    }

    @Transactional
    public void useCheck(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (user.getChecksAvailable() == null || user.getChecksAvailable() <= 0) {
            throw new IllegalStateException("User has no available checks");
        }
        
        user.setChecksAvailable(user.getChecksAvailable() - 1);
        userRepository.save(user);
    }
    
    private UserProfileDTO mapToDto(User user) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .patronymic(user.getPatronymic())
                .city(user.getCity())
                .institution(user.getInstitution())
                .checksAvailable(user.getChecksAvailable())
                .build();
    }
} 