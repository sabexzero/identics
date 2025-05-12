package org.identics.monolith.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.identics.monolith.domain.tag.Tag;
import org.identics.monolith.domain.user.User;
import org.identics.monolith.domain.user.UserSettings;
import org.identics.monolith.repository.TagRepository;
import org.identics.monolith.repository.UserRepository;
import org.identics.monolith.repository.UserSettingsRepository;
import org.identics.monolith.web.requests.auth.UserRegistrationRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final TagRepository tagRepository;

    /**
     * Creates a new user and their default settings
     * This method is called after successful registration in KeyCloak
     * 
     * @param request Registration request with user details
     * @return The created user
     */
    @Transactional
    public User createUser(UserRegistrationRequest request) {
        log.info("Creating new user: {}", request.getEmail());
        
        // Create and save the user
        User user = User.builder()
                .name(request.getName())
                .city(request.getCity())
                .institution(request.getInstitution())
                .checksAvailable(100000) // Default to 0 available checks
                .build();
        
        User savedUser = userRepository.save(user);
        log.info("User created with ID: {}", savedUser.getId());
        
        // Create and save default user settings
        UserSettings userSettings = UserSettings.builder()
                .userId(savedUser.getId())
                .isTelegramNotificationsEnabled(false)
                .isBrowserNotificationsEnabled(true)
                .isWebHookNotificationsEnabled(false)
                .isApiCallsLoggingEnabled(false)
                .build();
        
        userSettingsRepository.save(userSettings);
        log.info("Default settings created for user ID: {}", savedUser.getId());

        tagRepository.saveAll(
            List.of(
                Tag.builder()
                    .userId(savedUser.getId())
                    .name("Избранное")
                    .hexString("#3390EC")
                    .isDefaultTag(true)
                    .build()
            )
        );

        return savedUser;
    }
} 