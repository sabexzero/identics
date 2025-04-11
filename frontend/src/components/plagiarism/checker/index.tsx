import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "@/components/plagiarism/file-uploader";
import { Loader2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUploadTextDocumentMutation } from "@/api/documentApi";
import { Input } from "@/components/ui/input.tsx";
import { toast } from "sonner";
import { ErrorHandler } from "@/api/store.ts";

const textFormSchema = z.object({
    content: z.string().min(100, { message: "Текст должен содержать минимум 100 символов" }),
    title: z.string().min(3, { message: "Название должно содержать минимум 3 символова" }),
});

export function PlagiarismChecker() {
    const [activeTab, setActiveTab] = useState("text");
    const navigate = useNavigate();

    const [uploadTextDocument, { isLoading }] = useUploadTextDocumentMutation();

    const form = useForm<z.infer<typeof textFormSchema>>({
        resolver: zodResolver(textFormSchema),
        defaultValues: {
            content: "",
            title: "",
        },
    });

    const onTextUpload = async (values: z.infer<typeof textFormSchema>) => {
        try {
            await uploadTextDocument({
                userId: 1,
                content: values.content,
                title: values.title,
            });

            toast.success("Текст успешно отправился на обработку");
        } catch (error) {
            toast.error(
                `Возникла ошибка при отправке данных: ${(error as ErrorHandler).data.error}`
            );
        }
    };

    const onFileUpload = (files: File[]) => {
        console.log(files);
        // Имитация загрузки файла - в реальном приложении здесь будет вызов вашего бэкенда
        setTimeout(() => {
            navigate("/dashboard/results/123");
        }, 2000);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Проверка на плагиат</CardTitle>
                <CardDescription>
                    Проверьте ваш текст или документ на плагиат и получите детальные результаты.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="text">Текст</TabsTrigger>
                        <TabsTrigger value="file">Загрузка файла</TabsTrigger>
                    </TabsList>

                    <TabsContent value="text">
                        <Form {...form}>
                            <form
                                className="flex flex-col gap-y-4"
                                onSubmit={form.handleSubmit(onTextUpload)}
                            >
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="Название файла"
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
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Вставьте ваш текст сюда (минимум 100 символов)..."
                                                    className="min-h-[200px] resize-none"
                                                    disabled={isLoading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end mt-4">
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Проверка...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="mr-2 h-4 w-4" />
                                                Проверить на плагиат
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="file">
                        <FileUploader onUpload={onFileUpload} isLoading={isLoading} />
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="flex-col items-start border-t p-4">
                <div className="text-sm text-muted-foreground">
                    <p className="mb-1">Поддерживаемые форматы файлов: .doc, .docx, .pdf, .txt</p>
                    <p>Максимальный размер файла: 10МБ</p>
                </div>
            </CardFooter>
        </Card>
    );
}
