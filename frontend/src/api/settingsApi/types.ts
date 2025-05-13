export interface IGetSettings {
    userId: number;
}

export interface ISettingsResponse {
    id: number;
    userId: number;
    isWebHookNotificationsEnabled: true;
    isApiCallsLoggingEnabled: true;
    apiWebhookUrl: string;
    apiKey: string;
    isCompleteCheckNotificationsEnabled: boolean;
}

export interface IEditSettings {
    userId: number;
    isWebHookNotificationsEnabled: true;
    isApiCallsLoggingEnabled: true;
    apiWebhookUrl: string;
    apiKey: string;
    isCompleteCheckNotificationsEnabled: boolean;
}
