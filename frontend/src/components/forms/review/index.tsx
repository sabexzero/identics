import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Loader2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ErrorHandler } from "@/api/store.ts";
import { schema } from "@/components/forms/review/schema.ts";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import { useUploadInfoForReportMutation } from "@/api/documentApi";
import { useParams } from "react-router-dom";

interface CreateReviewReportFormProps {
    onOpenChange: () => void;
}

export default function CreateReviewReportForm({ onOpenChange }: CreateReviewReportFormProps) {
    const { id } = useParams();
    const [reportType, setReportType] = useState("PDF");
    const [uploadInfoForReport, { isLoading }] = useUploadInfoForReportMutation();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            university: "",
            student: "",
            reviewer: "",
            department: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            const response = await uploadInfoForReport({
                university: values.university,
                department: values.department,
                reviewer: values.reviewer,
                student: values.student,
                format: reportType,
                id: +id!,
            }).unwrap();

            const reportUrl = response.url;
            window.open(reportUrl, "_blank");

            onOpenChange();
        } catch (error) {
            toast.error("Ошибка", {
                description: `Возникла ошибка при отправке данных: ${(error as ErrorHandler).data.error}`,
            });
            onOpenChange();
        }
    };

    return (
        <Form {...form}>
            <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="Название учебного учреждения"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="Название кафедры"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="reviewer"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    placeholder="Имя проверяющего"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="student"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="Имя студента" disabled={isLoading} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Select defaultValue="PDF" value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="PDF">PDF</SelectItem>
                            <SelectItem value="HTML">HTML</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div className="flex justify-end mt-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Загрузка...
                            </>
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" />
                                Скачать отчет
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
