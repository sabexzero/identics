import * as z from "zod";

export const schema = z.object({
    name: z
        .string({ required_error: "Введите название" })
        .min(3, { message: "Название должно содержать минимум 8 символов" }),
    color: z.string(),
});
