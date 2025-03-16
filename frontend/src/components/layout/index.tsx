import { FileSystemSidebar } from "@/components/layout/file-system/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Bell, House, Menu, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="flex bg-background">
            <FileSystemSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <div className="flex-1">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                    <Button
                        variant="outline"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Меню</span>
                    </Button>

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
                                    className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
                                />
                            </div>
                        </form>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/dashboard/history")}
                            className="hidden md:flex"
                        >
                            История проверок
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="relative"
                        >
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                            <span className="sr-only">Уведомления</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <User className="h-4 w-4" />
                                    <span className="sr-only">
                                        Меню пользователя
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    Мой аккаунт
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Профиль</DropdownMenuItem>
                                <DropdownMenuItem>Настройки</DropdownMenuItem>
                                <DropdownMenuItem>Подписка</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => navigate("/auth")}
                                >
                                    Выйти
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 p-4 md:p-6">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
