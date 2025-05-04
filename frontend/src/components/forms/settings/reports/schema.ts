import * as z from "zod";

export const schema = z.object({
    reportFormat: z.enum(["pdf", "docx", "html"]),
    highlightStyle: z.enum(["highlight", "underline", "bold"]),
    includeOriginalText: z.boolean(),
    includeSimilarityScore: z.boolean(),
    includeSourceLinks: z.boolean(),
    includeStatistics: z.boolean(),
    reportColorScheme: z.enum(["standard", "highContrast", "monochrome"]),
    reportRetentionDays: z.number().min(1).max(365),
});
