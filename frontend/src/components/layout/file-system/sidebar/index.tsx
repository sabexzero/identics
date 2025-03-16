import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Input } from "@/components/ui/input.tsx";
import { FolderPlus, Home, LogOut, Search, Settings, X } from "lucide-react";
import { Logo } from "@/components/ui/logo.tsx";
import { FileSystemFolder } from "@/components/layout/file-system/folder";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";

interface FileSystemSidebarProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export interface FileSystemItem {
    id: string;
    name: string;
    type: "folder" | "file";
    files?: string[]; // Для папок - список файлов
    children?: FileSystemItem[]; // Для папок - вложенные папки
}

// Моковые данные для файловой системы
const initialFileSystem: FileSystemItem[] = [
    {
        id: "folder-1",
        name: "Научные работы",
        type: "folder",
        files: ["Введение.docx", "Обзор литературы.docx", "Методология.docx"],
        children: [
            {
                id: "folder-1-1",
                name: "Исследования",
                type: "folder",
                files: ["Эксперимент 1.docx", "Эксперимент 2.docx"],
                children: [],
            },
            {
                id: "folder-1-2",
                name: "Результаты",
                type: "folder",
                files: ["Анализ данных.docx", "Графики.docx"],
                children: [],
            },
        ],
    },
    {
        id: "folder-2",
        name: "Учебные материалы",
        type: "folder",
        files: ["Конспект лекций.docx", "Задания.docx"],
        children: [
            {
                id: "folder-2-1",
                name: "Семестр 1",
                type: "folder",
                files: ["Математика.docx", "Физика.docx"],
                children: [],
            },
            {
                id: "folder-2-2",
                name: "Семестр 2",
                type: "folder",
                files: ["Программирование.docx", "Базы данных.docx"],
                children: [
                    {
                        id: "folder-2-2-1",
                        name: "Проекты",
                        type: "folder",
                        files: ["Проект 1.docx", "Проект 2.docx"],
                        children: [],
                    },
                ],
            },
        ],
    },
    {
        id: "folder-3",
        name: "Личные документы",
        type: "folder",
        files: ["Резюме.docx", "Мотивационное письмо.docx"],
        children: [],
    },
];

//TODO: REFACTOR TO LAYOUT WITH OUTLET
export function FileSystemSidebar({
    isOpen,
    setIsOpen,
}: FileSystemSidebarProps) {
    const navigate = useNavigate();
    const [fileSystem, setFileSystem] =
        useState<FileSystemItem[]>(initialFileSystem);
    const [searchQuery, setSearchQuery] = useState("");

    // Функция для обновления файловой системы при перетаскивании
    const handleFolderMove = (draggedId: string, targetId: string) => {
        if (draggedId === targetId) return;

        // Рекурсивная функция для поиска и удаления папки из текущего местоположения
        const findAndRemoveFolder = (
            items: FileSystemItem[]
        ): [FileSystemItem | null, FileSystemItem[]] => {
            let removedFolder: FileSystemItem | null = null;
            const newItems: FileSystemItem[] = [];

            for (const item of items) {
                if (item.id === draggedId) {
                    removedFolder = { ...item };
                    continue;
                }

                if (item.children && item.children.length > 0) {
                    const [removed, newChildren] = findAndRemoveFolder(
                        item.children
                    );
                    if (removed) {
                        removedFolder = removed;
                        newItems.push({ ...item, children: newChildren });
                    } else {
                        newItems.push({ ...item });
                    }
                } else {
                    newItems.push({ ...item });
                }
            }

            return [removedFolder, newItems];
        };

        // Рекурсивная функция для добавления папки в новое местоположение
        const addFolderToTarget = (
            items: FileSystemItem[],
            folder: FileSystemItem
        ): FileSystemItem[] => {
            return items.map((item) => {
                if (item.id === targetId) {
                    return {
                        ...item,
                        children: [...(item.children || []), folder],
                    };
                }

                if (item.children && item.children.length > 0) {
                    return {
                        ...item,
                        children: addFolderToTarget(item.children, folder),
                    };
                }

                return item;
            });
        };

        // Находим и удаляем перетаскиваемую папку
        const [removedFolder, newFileSystem] = findAndRemoveFolder(fileSystem);

        // Если папка найдена, добавляем ее в целевую папку
        if (removedFolder) {
            const updatedFileSystem = addFolderToTarget(
                newFileSystem,
                removedFolder
            );
            setFileSystem(updatedFileSystem);
        }
    };

    return (
        <>
            {/* Мобильное наложение */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Сайдбар */}
            <DndProvider backend={HTML5Backend}>
                <div
                    className={`fixed inset-y-0 left-0 z-50 border-r bg-background transition-transform duration-300 md:static md:z-0 ${
                        isOpen
                            ? "translate-x-0"
                            : "-translate-x-full md:translate-x-0"
                    }`}
                >
                    <div className="flex h-16 items-center justify-between border-b px-4">
                        <div className="flex items-center">
                            <Logo className="h-8 w-8 mr-2" />
                            <span className="font-bold">ПлагиатСкан</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Закрыть сайдбар</span>
                        </Button>
                    </div>

                    <div className="p-4 border-b">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Поиск файлов..."
                                className="w-full pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <ScrollArea className="h-[calc(100vh-8.5rem)]">
                        <div className="flex flex-col gap-2 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold tracking-tight">
                                    Мои документы
                                </h2>
                                <Button variant="ghost" size="icon">
                                    <FolderPlus className="h-4 w-4" />
                                    <span className="sr-only">Новая папка</span>
                                </Button>
                            </div>

                            <div className="space-y-1">
                                {fileSystem.map((item) => (
                                    <FileSystemFolder
                                        key={item.id}
                                        item={item}
                                        level={0}
                                        onFolderMove={handleFolderMove}
                                    />
                                ))}
                            </div>

                            <div className="mt-6">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    <Home className="mr-2 h-4 w-4" />
                                    Панель управления
                                </Button>
                            </div>

                            <div className="mt-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() =>
                                        navigate("/dashboard/history")
                                    }
                                >
                                    <Search className="mr-2 h-4 w-4" />
                                    История проверок
                                </Button>
                            </div>

                            <div className="mt-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Настройки
                                </Button>
                            </div>

                            <div className="mt-auto pt-6">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-muted-foreground"
                                    onClick={() => navigate("/")}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Выйти
                                </Button>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </DndProvider>
        </>
    );
}
