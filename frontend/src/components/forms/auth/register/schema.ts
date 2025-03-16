import * as z from "zod";

export const schema = z
    .object({
        name: z
            .string()
            .min(2, { message: "Имя должно содержать минимум 2 символа" }),
        email: z
            .string()
            .email({ message: "Пожалуйста, введите корректный email" }),
        password: z
            .string()
            .min(8, { message: "Пароль должен содержать минимум 8 символов" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });
