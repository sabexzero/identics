import type React from "react";
import { useState } from "react";
import { FileText, Loader2, Search, Upload, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input.tsx";
import { useUploadFileDocumentMutation } from "@/api/documentApi";
import { toast } from "sonner";
import { ErrorHandler } from "@/api/store.ts";
import { schema } from "@/components/forms/dashboard/file/schema.ts";

export function FileUploaderForm() {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadFile, { isLoading }] = useUploadFileDocumentMutation();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            file: undefined,
        },
    });

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            form.setValue("file", file, {
                shouldValidate: true,
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            form.setValue("file", file, {
                shouldValidate: true,
            });
        }
    };

    const removeFile = () => {
        form.setValue("file", undefined);
    };

    const onSubmit = async (data: z.infer<typeof schema>) => {
        if (!data.file) return;
        try {
            await uploadFile({
                file: data.file,
                title: data.title,
            }).unwrap();

            toast.success("Файл успешно отправился на обработку");
        } catch (error) {
            toast.error("Ошибка!", {
                description: `Возникла ошибка при отправке данных: ${(error as ErrorHandler).data.error}`,
            });
        }
    };

    const file = form.watch("file");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                                        isDragging
                                            ? "border-primary bg-primary/5"
                                            : "border-muted-foreground/20"
                                    }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="rounded-full bg-primary/10 p-3">
                                            <Upload className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-medium">
                                            Перетащите файл сюда
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            или нажмите, чтобы выбрать файл с компьютера
                                        </p>

                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            accept=".doc,.docx,.pdf,.txt"
                                            disabled={isLoading}
                                            {...field}
                                            onChange={handleFileChange}
                                            value={undefined}
                                        />
                                        <label htmlFor="file-upload">
                                            <Button
                                                variant="outline"
                                                className="mt-2"
                                                disabled={isLoading}
                                                type="button"
                                                onClick={() =>
                                                    document.getElementById("file-upload")?.click()
                                                }
                                            >
                                                Выбрать файл
                                            </Button>
                                        </label>
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

                {file && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <div className="text-sm">
                                        <p className="font-medium">{file.name}</p>
                                        <p className="text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} МБ
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={removeFile}
                                    disabled={isLoading}
                                    type="button"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isLoading || !file || !!form.formState.errors.file}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Загрузка...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-4 w-4" />
                                        Проверить на плагиат
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}

                {form.formState.errors.file && (
                    <p className="text-sm text-red-500 mt-2">
                        {form.formState.errors.file.message}
                    </p>
                )}
            </form>
        </Form>
    );
}
