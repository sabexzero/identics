import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    AlertCircle,
    CheckCircle,
    FileText,
    Clock,
    BrainCircuit,
    ExternalLink,
} from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { reviewAiContentHighlights, reviewSources, reviewTextWithHighlights } from "@/lib/mock.ts";
import { useParams } from "react-router-dom";
import { useGetDocumentByIdQuery } from "@/api/documentApi";
import { formatDate } from "@/lib/utils.ts";
import { useState } from "react";
import CreateReviewReport from "@/components/dialogs/review/create.tsx";

export default function ReviewPage() {
    const { id } = useParams();
    const { data: document } = useGetDocumentByIdQuery({ id: +id! });

    const [open, onOpenChange] = useState(false);

    return (
        <>
            <CreateReviewReport open={open} onOpenChange={() => onOpenChange(false)} />
            <div className="grid gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Результаты проверки</h1>
                    <p className="text-muted-foreground">Детальный анализ вашего документа.</p>
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle>{document?.title}</CardTitle>
                                <CardDescription>
                                    Проверено {formatDate(document?.checkDate)} •{" "}
                                    {document?.wordCount} слов
                                </CardDescription>
                            </div>
                            <div className="flex items-center space-x-1 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{document?.processingTime} с.</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Оригинальность</span>
                                    </div>
                                    <span className="font-bold">
                                        {document?.uniqueness.toFixed(2)}%
                                    </span>
                                </div>
                                <Progress value={document?.uniqueness} className="h-2" />
                                {typeof document?.uniqueness === "number" && (
                                    <p className="text-xs text-muted-foreground">
                                        {document.uniqueness > 85
                                            ? "Отличный показатель оригинальности. Ваш текст высоко уникален."
                                            : document.uniqueness > 70
                                              ? "Хороший показатель оригинальности. Возможно, потребуются незначительные правки."
                                              : "Низкий показатель оригинальности. Рекомендуется переработать текст."}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BrainCircuit className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Содержание ИИ</span>
                                    </div>
                                    {typeof document?.aiContent === "number" && (
                                        <div className="flex items-center">
                                            {document.aiContent > 10 ? (
                                                <AlertCircle className="mr-1 h-4 w-4 text-amber-500" />
                                            ) : (
                                                <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                                            )}
                                            <span className="font-bold">{document.aiContent}%</span>
                                        </div>
                                    )}
                                </div>
                                <Progress value={document?.aiContent} className="h-2" />
                                {typeof document?.aiContent === "number" && (
                                    <p className="text-xs text-muted-foreground">
                                        {document.aiContent < 5
                                            ? "Минимальное содержание ИИ-текста. Ваш текст написан преимущественно человеком."
                                            : document.aiContent < 15
                                              ? "Умеренное содержание ИИ-текста. Некоторые фрагменты могут быть сгенерированы ИИ."
                                              : "Высокое содержание ИИ-текста. Значительная часть текста может быть сгенерирована ИИ."}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="report" className="w-full">
                    <TabsContent value="details" className="mt-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="prose max-w-none dark:prose-invert">
                                    <div className="text-lg leading-relaxed">
                                        {reviewTextWithHighlights.map((segment) => (
                                            <span
                                                key={segment.id}
                                                className={
                                                    segment.highlighted
                                                        ? "relative bg-yellow-100 dark:bg-yellow-900/30 px-0.5 rounded group"
                                                        : ""
                                                }
                                            >
                                                {segment.text}
                                                {segment.highlighted && (
                                                    <div className="absolute bottom-full left-0 mb-2 hidden w-72 rounded-lg border bg-card p-3 shadow-lg group-hover:block z-10">
                                                        <div className="text-sm font-medium">
                                                            Потенциальное совпадение
                                                        </div>
                                                        <div className="mt-1 text-xs text-muted-foreground">
                                                            {segment.similarity}% совпадение с
                                                            источником:
                                                        </div>
                                                        <div className="mt-1 text-xs font-medium">
                                                            {segment.source}
                                                        </div>
                                                    </div>
                                                )}
                                            </span>
                                        ))}

                                        {reviewAiContentHighlights.map((segment) => (
                                            <span
                                                key={segment.id}
                                                className={
                                                    segment.isAI
                                                        ? "relative bg-blue-100 dark:bg-blue-900/30 px-0.5 rounded group"
                                                        : ""
                                                }
                                            >
                                                {segment.text}
                                                {segment.isAI && (
                                                    <div className="absolute bottom-full left-0 mb-2 hidden w-72 rounded-lg border bg-card p-3 shadow-lg group-hover:block z-10">
                                                        <div className="text-sm font-medium">
                                                            Текст, созданный ИИ
                                                        </div>
                                                        <div className="mt-1 text-xs text-muted-foreground">
                                                            Уверенность: {segment.confidence}%
                                                        </div>
                                                    </div>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="sources" className="mt-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {reviewSources.map((source) => (
                                        <div
                                            key={source.id}
                                            className="border-b pb-4 last:border-0 last:pb-0"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <h3 className="font-medium">{source.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {source.author} ({source.year})
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                                                    <span>{source.similarity}% совпадение</span>
                                                </div>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <FileText className="mr-1 h-3.5 w-3.5" />
                                                    <span>
                                                        {source.matchedWords} совпадающих слов
                                                    </span>
                                                </div>
                                                <a
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-sm text-primary hover:underline"
                                                >
                                                    Просмотреть источник
                                                    <ExternalLink className="ml-1 h-3 w-3" />
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="report" className="mt-6">
                        <div className="rounded-lg border p-8 text-center">
                            <h3 className="text-lg font-medium">Полный отчет</h3>
                            <p className="mt-2 text-muted-foreground">
                                Полный отчет доступен для скачивания!<br></br> Но сначала надо будет
                                заполнить небольшой информационный бланк.
                            </p>
                            <button
                                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                                onClick={() => onOpenChange(true)}
                            >
                                Заполнить
                            </button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
