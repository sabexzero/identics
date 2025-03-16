import { PlagiarismChecker } from "@/components/plagiarism/checker";
import { RecentChecks } from "@/components/plagiarism/recent-checks";

export default function DashboardPage() {
    return (
        <div className="grid gap-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Панель управления
                </h1>
                <p className="text-muted-foreground">
                    Проверьте ваш текст на плагиат и обеспечьте его
                    уникальность.
                </p>
            </div>

            <div className="grid gap-6 grid-cols-1 xl:grid-cols-7">
                <div className="xl:col-span-4">
                    <PlagiarismChecker />
                </div>
                <div className="xl:col-span-3">
                    <RecentChecks />
                </div>
            </div>
        </div>
    );
}
