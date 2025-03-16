import type React from "react";

import { useState } from "react";
import { FileText, Loader2, Search, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
    onUpload: (files: File[]) => void;
    isLoading: boolean;
}

export function FileUploader({ onUpload, isLoading }: FileUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const fileArray = Array.from(e.target.files);
            setFiles(fileArray);
        }
    };

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
            const fileArray = Array.from(e.dataTransfer.files);
            setFiles(fileArray);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (files.length === 0) return;

        // Имитация прогресса загрузки
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 10;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
                onUpload(files);
            }
        }, 200);
    };

    return (
        <div className="space-y-4">
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
                        onChange={handleFileChange}
                        disabled={isLoading}
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

            {files.length > 0 && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border p-3"
                            >
                                <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-primary" />
                                    <div className="text-sm">
                                        <p className="font-medium">
                                            {file.name}
                                        </p>
                                        <p className="text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(
                                                2
                                            )}{" "}
                                            МБ
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFile(index)}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {progress > 0 && progress < 100 && (
                        <div className="space-y-2">
                            <Progress value={progress} />
                            <p className="text-xs text-right text-muted-foreground">
                                {progress}% загружено
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || files.length === 0}
                        >
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
                </div>
            )}
        </div>
    );
}
