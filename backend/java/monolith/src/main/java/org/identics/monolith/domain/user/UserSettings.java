package org.identics.monolith.domain.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_settings")
public class UserSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    // Notifications
    private Boolean isTelegramNotificationsEnabled = false;
    private Boolean isBrowserNotificationsEnabled = false;

    // Report formatting
    private ReportPlagiarismSelectorStyle reportPlagiarismSelectorStyle = ReportPlagiarismSelectorStyle.UNDERSCORING;
    private ReportColorMap reportColorMap = ReportColorMap.BLUE_GREEN_ORANGE;
    private ReportFileFormat reportFileFormat = ReportFileFormat.PDF;

    //API
    private Boolean isWebHookNotificationsEnabled = false;
    private Boolean isApiCallsLoggingEnabled = false;
    private String apiWebhookUrl = null;
}
