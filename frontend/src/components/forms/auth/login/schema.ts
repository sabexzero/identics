import * as z from "zod";

export const schema = z.object({
    email: z
        .string()
        .email({ message: "Пожалуйста, введите корректный email" }),
    password: z
        .string()
        .min(8, { message: "Пароль должен содержать минимум 8 символов" }),
});
