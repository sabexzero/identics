package org.identics.monolith.web.requests;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class UpdateUserSettingsRequest {
    @NotNull(message = "Поле telegramNotificationsEnabled не может быть null")
    private Boolean isTelegramNotificationsEnabled;

    @NotNull(message = "Поле browserNotificationsEnabled не может быть null")
    private Boolean isBrowserNotificationsEnabled;

    @NotNull(message = "Поле reportPlagiarismSelectorStyle не может быть null")
    private ReportPlagiarismSelectorStyle reportPlagiarismSelectorStyle;

    @NotNull(message = "Поле reportColorMap не может быть null")
    private ReportColorMap reportColorMap;

    @NotNull(message = "Поле reportFileFormat не может быть null")
    private ReportFileFormat reportFileFormat;

    @NotNull(message = "Поле webHookNotificationsEnabled не может быть null")
    private Boolean isWebHookNotificationsEnabled;

    @NotNull(message = "Поле apiCallsLoggingEnabled не может быть null")
    private Boolean isApiCallsLoggingEnabled;

    @Size(max = 255, message = "URL вебхука не может превышать 255 символов")
    private String apiWebhookUrl;
}