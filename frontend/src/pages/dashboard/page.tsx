import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { FileUploaderForm } from "@/components/forms/dashboard/file";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetDocumentsQuery } from "@/api/documentApi";
import { formatDate } from "@/lib/utils.ts";
import TextUploaderForm from "@/components/forms/dashboard/text";
import { useSelector } from "react-redux";
import { RootState } from "@/api/store.ts";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("text");
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.user.userId);

    const { data } = useGetDocumentsQuery({
        userId: userId!,
        page: 0,
        size: 3,
        sortBy: "date",
    });

    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
                <p className="text-muted-foreground">
                    Проверьте ваш текст на плагиат и обеспечьте его уникальность.
                </p>
            </div>

            <div className="grid gap-6 grid-cols-1 xl:grid-cols-7">
                <div className="xl:col-span-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Проверка на плагиат</CardTitle>
                            <CardDescription>
                                Проверьте ваш текст или документ на плагиат и получите детальные
                                результаты.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs
                                defaultValue="text"
                                value={activeTab}
                                onValueChange={setActiveTab}
                            >
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                    <TabsTrigger value="text">Текст</TabsTrigger>
                                    <TabsTrigger value="file">Загрузка файла</TabsTrigger>
                                </TabsList>

                                <TabsContent value="text">
                                    <TextUploaderForm />
                                </TabsContent>

                                <TabsContent value="file">
                                    <FileUploaderForm />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                        <CardFooter className="flex-col items-start border-t p-4">
                            <div className="text-sm text-muted-foreground">
                                <p className="mb-1">
                                    Поддерживаемые форматы файлов: .doc, .docx, .pdf, .txt
                                </p>
                                <p>Максимальный размер файла: 10МБ</p>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
                <div className="xl:col-span-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle>Недавние проверки</CardTitle>
                                <CardDescription>
                                    Ваши недавно проверенные документы.
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                className="text-sm"
                                onClick={() => navigate("/dashboard/history")}
                            >
                                Все
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data?.content.map((check) => (
                                    <div
                                        key={check.id}
                                        className="flex items-start space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50"
                                        onClick={() => navigate(`/dashboard/review/${check.id}`)}
                                    >
                                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="space-y-1">
                                            <p className="font-medium leading-none">
                                                {check.title}
                                            </p>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <span>{formatDate(check.checkDate)}</span>
                                                <span className="mx-2">•</span>
                                                <span className="flex items-center">
                                                    {check.uniqueness}%
                                                </span>
                                                <span className="mx-2">•</span>
                                                <span className="flex items-center">
                                                    {check.aiLevel}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
