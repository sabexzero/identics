import * as z from "zod";

export const schema = z.object({
    name: z
        .string({ required_error: "Необходимо указать новое ФИО" })
        .min(6, "Имя должно иметь более 5 символов")
        .max(50, "Имя не должно превышать 50 символов"),
    email: z.string({ required_error: "Необходимо указать email" }).email("Неверный формат адреса"),
});
