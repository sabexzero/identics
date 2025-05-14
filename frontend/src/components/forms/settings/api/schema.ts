import * as z from "zod";

export const schema = z.object({
    apiKey: z.string().min(1, { message: "API ключ обязателен" }),
    apiWebhookUrl: z.string().url({ message: "Введите корректный URL" }).or(z.string().length(0)),
    isWebHookNotificationsEnabled: z.boolean(),
    isApiCallsLoggingEnabled: z.boolean(),
});
