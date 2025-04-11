import {
    LayoutDashboard,
    History,
    Settings,
    BookOpen,
    BarChart2,
    HelpCircle,
    ChevronDown,
    LogOut,
    User,
    Bell,
    Sparkles,
    FileCheck,
    Bookmark,
    ChevronRight,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Menu {
    reports: boolean;
    resources: boolean;
}

export function AppSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [openMenus, setOpenMenus] = useState<Menu>({
        reports: true,
        resources: false,
    });

    const toggleMenu = (menu: keyof Menu) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    return (
        <Sidebar variant="sidebar" className="px-0 py-0">
            <SidebarHeader className="pb-0 gap-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <FileCheck className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">
                            АнтиПлагиат
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Профессиональная версия
                        </span>
                    </div>
                </div>
                <div className="pb-2">
                    <Input placeholder="Поиск..." className="h-9" />
                </div>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent className="overflow-hidden">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem
                                onClick={() => navigate("/dashboard")}
                            >
                                <SidebarMenuButton
                                    isActive={
                                        location.pathname === "/dashboard"
                                    }
                                    tooltip="Панель управления"
                                >
                                    <LayoutDashboard className="text-primary" />
                                    <span>Панель управления</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem
                                onClick={() => navigate("/dashboard/history")}
                            >
                                <SidebarMenuButton
                                    isActive={
                                        location.pathname ===
                                        "/dashboard/history"
                                    }
                                    tooltip="История проверок"
                                >
                                    <History />
                                    <span>История проверок</span>
                                </SidebarMenuButton>
                                <SidebarMenuBadge>12</SidebarMenuBadge>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Отчеты и аналитика</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <Collapsible
                            open={openMenus.reports}
                            onOpenChange={() => toggleMenu("reports")}
                            className="group/collapsible"
                        >
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip="Отчеты">
                                            <BarChart2 />
                                            <span>Отчеты</span>
                                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                </SidebarMenuItem>
                            </SidebarMenu>

                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton>
                                            <span>Отчеты о сходстве</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton>
                                            <span>Детальный анализ</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton>
                                            <span>Экспорт отчетов</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </Collapsible>

                        <Collapsible
                            open={openMenus.resources}
                            onOpenChange={() => toggleMenu("resources")}
                            className="group/collapsible"
                        >
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip="Ресурсы">
                                            <BookOpen />
                                            <span>Ресурсы</span>
                                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                </SidebarMenuItem>
                            </SidebarMenu>

                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton>
                                            <span>
                                                Руководство по цитированию
                                            </span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton>
                                            <span>Академическая честность</span>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </Collapsible>

                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Избранное">
                                    <Bookmark />
                                    <span>Избранное</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Система</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem
                                onClick={() => navigate("/dashboard/settings")}
                            >
                                <SidebarMenuButton
                                    tooltip="Настройки"
                                    isActive={
                                        location.pathname ===
                                        "/dashboard/settings"
                                    }
                                >
                                    <Settings />
                                    <span>Настройки</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton tooltip="Помощь">
                                    <HelpCircle />
                                    <span>Помощь и поддержка</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator />

            <SidebarFooter>
                <div className="px-3 py-2">
                    <div className="mb-2 space-y-1 rounded-lg bg-muted/50 p-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">
                                Использовано проверок
                            </span>
                            <span className="text-xs font-medium">70%</span>
                        </div>
                        <Progress value={70} className="h-1.5" />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                70/100
                            </span>
                            <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs"
                            >
                                <Sparkles className="mr-1 h-3 w-3" />
                                Обновить
                            </Button>
                        </div>
                    </div>
                </div>

                <SidebarMenu className="pb-4">
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton tooltip="Профиль пользователя">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage
                                                src="/placeholder.svg?height=32&width=32"
                                                alt="User"
                                            />
                                            <AvatarFallback className="text-xs">
                                                ИП
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col items-start">
                                            <span className="text-sm font-medium">
                                                Иван Петров
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                ivan@example.com
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="ml-auto h-4 w-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="flex items-center gap-2 p-2">
                                    <Avatar>
                                        <AvatarImage
                                            src="/placeholder.svg?height=40&width=40"
                                            alt="User"
                                        />
                                        <AvatarFallback>ИП</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            Иван Петров
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            ivan@example.com
                                        </span>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Профиль</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Bell className="mr-2 h-4 w-4" />
                                    <span>Уведомления</span>
                                    <Badge
                                        variant="secondary"
                                        className="ml-auto"
                                    >
                                        3
                                    </Badge>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Настройки аккаунта</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Выйти</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
