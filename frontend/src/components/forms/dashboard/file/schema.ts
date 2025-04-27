import * as z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
];

export const schema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "Файл должен быть меньше 5MB",
        })
        .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
            message: "Поддерживаются только .doc, .docx, .pdf и .txt файлы",
        })
        .optional(),
    title: z
        .string({ required_error: "Название должно содержать минимум 3 символа" })
        .min(3, "Название должно содержать минимум 3 символа"),
});
