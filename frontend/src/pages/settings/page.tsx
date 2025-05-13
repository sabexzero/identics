import ProfileSettings from "@/components/forms/settings/profile";
import NotificationSettings from "@/components/forms/settings/notifications";
import ReportSettings from "@/components/forms/settings/reports";
import ApiSettings from "@/components/forms/settings/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";

export default function Settings() {
    const lastVisitedTab = sessionStorage.getItem("lastVisitedTab") || "profile";

    const handleClick = (tab: string) => {
        sessionStorage.setItem("lastVisitedTab", tab);
    };

    return (
        <div className="flex flex-col">
            <Tabs defaultValue={`${lastVisitedTab}`}>
                <TabsList>
                    <TabsTrigger value="profile" onClick={() => handleClick("profile")}>
                        Профиль
                    </TabsTrigger>
                    <TabsTrigger value="notifications" onClick={() => handleClick("notifications")}>
                        Уведомления
                    </TabsTrigger>
                    <TabsTrigger value="api" onClick={() => handleClick("api")}>
                        API
                    </TabsTrigger>
                    <TabsTrigger
                        disabled={true}
                        value="reports"
                        onClick={() => handleClick("reports")}
                    >
                        Отчеты
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <ProfileSettings />
                </TabsContent>
                <TabsContent value="notifications">
                    <NotificationSettings />
                </TabsContent>
                <TabsContent value="api">
                    <ApiSettings />
                </TabsContent>
                <TabsContent aria-disabled={true} value="reports">
                    <ReportSettings />
                </TabsContent>
            </Tabs>
        </div>
    );
}
