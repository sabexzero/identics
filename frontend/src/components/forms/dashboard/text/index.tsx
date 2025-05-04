import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Loader2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ErrorHandler, RootState } from "@/api/store.ts";
import { schema } from "@/components/forms/dashboard/text/schema.ts";
import { useUploadTextDocumentMutation } from "@/api/documentApi";
import { useSelector } from "react-redux";

export default function TextUploaderForm() {
    const [uploadTextDocument, { isLoading }] = useUploadTextDocumentMutation();
    const userId = useSelector((state: RootState) => state.user.userId);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            content: "",
            title: "",
        },
    });

    const onTextUpload = async (values: z.infer<typeof schema>) => {
        try {
            await uploadTextDocument({
                userId: userId!,
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

    return (
        <Form {...form}>
            <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onTextUpload)}>
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
    );
}
