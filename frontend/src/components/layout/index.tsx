import { AppSidebar } from "@/components/layout/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Bell, House, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { Toaster } from "sonner";

export default function Layout() {
    const navigate = useNavigate();

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

                            <Button
                                variant="outline"
                                size="icon"
                                className="relative"
                            >
                                <Bell className="h-4 w-4" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                                <span className="sr-only">Уведомления</span>
                            </Button>
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
