package org.identics.monolith.service;

import lombok.RequiredArgsConstructor;
import org.identics.monolith.domain.user.UserSettings;
import org.identics.monolith.repository.UserSettingsRepository;
import org.identics.monolith.web.requests.UpdateUserSettingsRequest;
import org.identics.monolith.web.responses.UserSettingsResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserSettingsService {
    private final UserSettingsRepository userSettingsRepository;

    public UserSettingsResponse getUserSettings(Long userId) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("Settings not found for userId=" + userId));
        return mapToDto(settings);
    }

    @Transactional
    public UserSettingsResponse updateUserSettings(Long userId, UpdateUserSettingsRequest request) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("Settings not found for userId=" + userId));

        settings.setIsTelegramNotificationsEnabled(request.getIsTelegramNotificationsEnabled());
        settings.setIsBrowserNotificationsEnabled(request.getIsBrowserNotificationsEnabled());
        settings.setReportPlagiarismSelectorStyle(request.getReportPlagiarismSelectorStyle());
        settings.setReportColorMap(request.getReportColorMap());
        settings.setReportFileFormat(request.getReportFileFormat());
        settings.setIsWebHookNotificationsEnabled(request.getIsWebHookNotificationsEnabled());
        settings.setIsApiCallsLoggingEnabled(request.getIsApiCallsLoggingEnabled());
        settings.setApiWebhookUrl(request.getApiWebhookUrl());

        return mapToDto(userSettingsRepository.save(settings));
    }

    private UserSettingsResponse mapToDto(UserSettings settings) {
        return UserSettingsResponse.builder()
            .id(settings.getId())
            .userId(settings.getUserId())
            .isTelegramNotificationsEnabled(settings.getIsTelegramNotificationsEnabled())
            .isBrowserNotificationsEnabled(settings.getIsBrowserNotificationsEnabled())
            .reportPlagiarismSelectorStyle(settings.getReportPlagiarismSelectorStyle())
            .reportColorMap(settings.getReportColorMap())
            .reportFileFormat(settings.getReportFileFormat())
            .isWebHookNotificationsEnabled(settings.getIsWebHookNotificationsEnabled())
            .isApiCallsLoggingEnabled(settings.getIsApiCallsLoggingEnabled())
            .apiWebhookUrl(settings.getApiWebhookUrl())
            .build();
    }
}