import * as z from "zod";

export const schema = z.object({
    name: z.string({ required_error: "Необходимо указать новое ФИО" }),
    email: z
        .string({ required_error: "Необходимо указать email" })
        .email("Неверный формат адреса"),
    phone: z.string({ required_error: "Необходимо указать номер телефона" }),
});
