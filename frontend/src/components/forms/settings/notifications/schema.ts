import * as z from "zod";

export const schema = z.object({
    emailNotifications: z.boolean(),
    browserNotifications: z.boolean(),
    reportReadyNotifications: z.boolean(),
});
