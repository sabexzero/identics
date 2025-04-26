package org.identics.monolith.web.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.identics.monolith.domain.user.ReportPlagiarismSelectorStyle;
import org.identics.monolith.domain.user.ReportColorMap;
import org.identics.monolith.domain.user.ReportFileFormat;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsResponse {
    private Long id;
    private Long userId;
    private Boolean isTelegramNotificationsEnabled;
    private Boolean isBrowserNotificationsEnabled;
    private ReportPlagiarismSelectorStyle reportPlagiarismSelectorStyle;
    private ReportColorMap reportColorMap;
    private ReportFileFormat reportFileFormat;
    private Boolean isWebHookNotificationsEnabled;
    private Boolean isApiCallsLoggingEnabled;
    private String apiWebhookUrl;
}