import * as z from "zod";

export const schema = z.object({
    apiKey: z.string().min(1, { message: "API ключ обязателен" }),
    enableApi: z.boolean(),
    rateLimitPerMinute: z.number().min(10).max(500),
    allowedDomains: z.string(),
    webhookUrl: z
        .string()
        .url({ message: "Введите корректный URL" })
        .or(z.string().length(0)),
    notifyOnCompletion: z.boolean(),
    apiVersion: z.enum(["v1", "v2", "v3-beta"]),
    logApiCalls: z.boolean(),
});
