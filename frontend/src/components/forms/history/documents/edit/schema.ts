import * as z from "zod";

export const schema = z.object({
    tags: z.array(z.number()),
    title: z.string({ required_error: "Укажите название" }),
});
