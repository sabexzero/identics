import * as z from "zod";

export const schema = z.object({
    content: z.string().min(100, { message: "Текст должен содержать минимум 100 символов" }),
    title: z.string().min(3, { message: "Название должно содержать минимум 3 символова" }),
});
