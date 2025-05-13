import * as z from "zod";

export const schema = z.object({
    telegramNotifications: z.boolean(),
    browserNotifications: z.boolean(),
    isCompleteCheckNotificationsEnabled: z.boolean(),
});
