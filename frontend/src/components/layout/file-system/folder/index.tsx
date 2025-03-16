import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
    ChevronDown,
    ChevronRight,
    File,
    Folder,
    MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import type { FileSystemItem } from "src/components/layout/file-system/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

interface FileSystemFolderProps {
    item: FileSystemItem;
    level: number;
    onFolderMove: (draggedId: string, targetId: string) => void;
}

// Тип для drag-and-drop
interface DragItem {
    id: string;
    type: string;
}

export function FileSystemFolder({
    item,
    level,
    onFolderMove,
}: FileSystemFolderProps) {
    const [isOpen, setIsOpen] = useState(level === 0);

    // Настройка drag-and-drop
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "FOLDER",
        item: { id: item.id, type: "FOLDER" } as DragItem,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: "FOLDER",
        drop: (draggedItem: DragItem) => {
            onFolderMove(draggedItem.id, item.id);
        },
        canDrop: (draggedItem: DragItem) => draggedItem.id !== item.id,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }));

    // Стили для визуализации drag-and-drop
    const dropIndicatorStyle =
        isOver && canDrop
            ? "border-2 border-primary border-dashed bg-primary/5"
            : "";

    const hasChildren = item.children && item.children.length > 0;
    const hasFiles = item.files && item.files.length > 0;

    return (
        <div
            // @ts-expect-error: dnd refs unexpected type
            ref={drop}
            className={cn(
                "rounded-md transition-colors",
                dropIndicatorStyle,
                isDragging ? "opacity-50" : ""
            )}
        >
            <div
                // @ts-expect-error: dnd refs unexpected type
                ref={drag}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {hasChildren ? (
                        isOpen ? (
                            <ChevronDown className="h-4 w-4 shrink-0" />
                        ) : (
                            <ChevronRight className="h-4 w-4 shrink-0" />
                        )
                    ) : (
                        <span className="w-4" />
                    )}
                    <Folder className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{item.name}</span>

                    {hasFiles && (
                        <span className="ml-2 text-xs text-muted-foreground">
                            ({item.files?.length})
                        </span>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Действия</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Переименовать</DropdownMenuItem>
                        <DropdownMenuItem>Добавить подпапку</DropdownMenuItem>
                        <DropdownMenuItem>Добавить файл</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            Удалить
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Файлы в папке */}
            {isOpen && hasFiles && (
                <div className="ml-6 pl-6 border-l border-dashed border-muted-foreground/20">
                    {item.files?.map((fileName) => (
                        <div
                            key={fileName}
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                        >
                            <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="truncate">{fileName}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Вложенные папки */}
            {isOpen && hasChildren && (
                <div>
                    {item.children?.map((child) => (
                        <FileSystemFolder
                            key={child.id}
                            item={child}
                            level={level + 1}
                            onFolderMove={onFolderMove}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
