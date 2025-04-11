import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Моковые данные для недавних проверок
const recentChecks = [
    {
        id: "check-1",
        title: "Введение к научной работе",
        date: "2 часа назад",
        similarity: 12,
        aiContent: 5,
        status: "completed",
    },
    {
        id: "check-2",
        title: "Обзор литературы",
        date: "Вчера",
        similarity: 28,
        aiContent: 15,
        status: "completed",
    },
    {
        id: "check-3",
        title: "Методология исследования",
        date: "2 дня назад",
        similarity: 5,
        aiContent: 0,
        status: "completed",
    },
];

export function RecentChecks() {
    const navigate = useNavigate();

    return (
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
                    {recentChecks.map((check) => (
                        <div
                            key={check.id}
                            className="flex items-start space-x-3 rounded-md border p-3 cursor-pointer hover:bg-muted/50"
                            onClick={() =>
                                navigate(`/dashboard/review/${check.id}`)
                            }
                        >
                            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-medium leading-none">
                                    {check.title}
                                </p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <span>{check.date}</span>
                                    <span className="mx-2">•</span>
                                    <span className="flex items-center">
                                        {check.similarity > 20 ? (
                                            <AlertCircle className="mr-1 h-3 w-3 text-destructive" />
                                        ) : (
                                            <CheckCircle className="mr-1 h-3 w-3 text-primary" />
                                        )}
                                        {check.similarity}% совпадений
                                    </span>
                                    <span className="mx-2">•</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
