export interface ISettingsResponse {
    id: number;
    isWebHookNotificationsEnabled: boolean;
    isApiCallsLoggingEnabled: boolean;
    apiWebhookUrl: string;
    apiKey: string;
    isCompleteCheckNotificationsEnabled: boolean;
}

export interface IEditSettings {
    isWebHookNotificationsEnabled: boolean;
    isApiCallsLoggingEnabled: boolean;
    apiWebhookUrl: string;
    apiKey: string;
    isCompleteCheckNotificationsEnabled: boolean;
}
