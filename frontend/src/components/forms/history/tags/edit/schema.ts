import * as z from "zod";

export const schema = z.object({
    tags: z.array(z.number()),
});
