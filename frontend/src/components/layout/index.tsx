import { AppSidebar } from "@/components/layout/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Bell, Check, CheckCheck, House, Info, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast, Toaster } from "sonner";
import { NotificationPayload, useNotifications } from "@/hooks/use-notifications.ts";
import { useState } from "react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "@/api/store.ts";

type NotificationType = "CHECK_COMPLETED" | "SYSTEM";

export default function Layout() {
    const base_url = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const userId = useSelector((state: RootState) => state.user.userId);

    const { notifications, markAllAsRead, markAsRead } = useNotifications({
        url: `${base_url}/api/ws`,
        onMessage: (data) => {
            toast(data.title, {
                description: data.message,
                position: "top-right",
            });
        },
    });

    return (
        <div className="flex bg-background">
            <SidebarProvider>
                <div className="w-fit border-none">
                    <AppSidebar />
                </div>

                <div className="flex-1">
                    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                        <SidebarTrigger />

                        <div className="flex flex-1 items-center justify-end gap-4">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/dashboard")}
                                className="hidden md:flex"
                            >
                                <House />
                            </Button>
                            <form>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Поиск..."
                                        className="w-full bg-background pl-8 md:w-[100px] lg:w-[200px]"
                                    />
                                </div>
                            </form>

                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className="relative">
                                        <Bell className="h-4 w-4" />
                                        {notifications.some((item) => !item.read) && (
                                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                                        )}
                                        <span className="sr-only">Уведомления</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0" align="end">
                                    <div className="flex items-center justify-between p-4 pb-2">
                                        <h3 className="font-medium">Уведомления</h3>
                                        {notifications.some((item) => !item.read) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-1 text-xs"
                                                onClick={() => markAllAsRead(userId!)}
                                            >
                                                <Check className="mr-1 h-3 w-3" />
                                                Прочитать все
                                            </Button>
                                        )}
                                    </div>
                                    <Separator />
                                    <ScrollArea className="h-[300px]">
                                        <RenderNotifications
                                            userId={userId}
                                            notifications={notifications}
                                            markAsRead={markAsRead}
                                        />
                                    </ScrollArea>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </header>

                    <main className="flex-1 p-4 md:p-6">
                        <div className="mx-auto max-w-7xl">
                            <Outlet />
                        </div>
                        <Toaster />
                    </main>
                </div>
            </SidebarProvider>
        </div>
    );
}

interface NotificationProps {
    notifications: NotificationPayload[];
    markAsRead: (userId: number | null, id: number) => void;
    userId: number | null;
}

function RenderNotifications({ notifications, markAsRead, userId }: NotificationProps) {
    const navigate = useNavigate();
    const items = notifications.filter((item) => !item.read);

    const getNotificationIcon = (type: NotificationType) => {
        switch (type) {
            case "CHECK_COMPLETED":
                return <CheckCheck className="h-4 w-4 text-green-500" />;
            case "SYSTEM":
                return <Info className="h-4 w-4 text-blue-500" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    const handleNotificationClick = (id: number, documentId: number) => {
        navigate(`/dashboard/review/${documentId}`);
        markAsRead(userId, id);
    };

    if (items.length === 0) {
        return (
            <div className="flex h-full items-center justify-center p-4">
                <p className="text-sm text-muted-foreground">Нет уведомлений</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 p-1">
            {items.map((notification, index) => (
                <div
                    key={index}
                    className="flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-muted"
                >
                    <div
                        className="mt-1 cursor-pointer"
                        onClick={() => markAsRead(userId, notification.id)}
                    >
                        {getNotificationIcon(notification.type as NotificationType)}
                    </div>
                    <div
                        className="flex-1 space-y-1"
                        onClick={() =>
                            handleNotificationClick(notification.id, notification.documentId)
                        }
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(notification.createdAt), "HH:mm")}
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
