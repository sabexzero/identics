import * as z from "zod";

export const schema = z.object({
    name: z
        .string({ required_error: "Введите название" })
        .min(3, { message: "Название должно содержать хотя бы 3 символа" })
        .max(20, { message: "Название не должно содержать более 20 символов" }),
    color: z.string(),
});
