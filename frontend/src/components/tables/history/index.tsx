"use client";

import type React from "react";
import { useRef, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Eye, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useGetDocumentsQuery } from "@/api/documentApi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditTagsDialog from "@/components/dialogs/history/tags/edit.tsx";
import { useGetTagsQuery } from "@/api/tagsApi";
import DeleteDocumentDialog from "@/components/dialogs/history/documents/delete.tsx";
import EditDocumentDialog from "@/components/dialogs/history/documents/create.tsx";
import { cn, formatDate } from "@/lib/utils.ts";
import { TablePagination } from "@/components/tables/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import { Card, CardContent } from "@/components/ui/card";
import { useResponsive } from "@/hooks/use-responsive.tsx";

interface HistoryTableProps {
    search: string;
    tag: string;
}

export default function HistoryTable({ search, tag }: HistoryTableProps) {
    const navigate = useNavigate();
    const idRef = useRef<number>(null!);
    const tagsRef = useRef<number[]>(null!);
    const { isMobile } = useResponsive();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const [editTagsDialogOpen, setEditTagsDialogOpen] = useState<boolean>(false);
    const [deleteDocumentDialogOpen, setDeleteDocumentDialogOpen] = useState<boolean>(false);
    const [editDocumentDialogOpen, setEditDocumentDialogOpen] = useState<boolean>(false);

    const { data, isLoading } = useGetDocumentsQuery({
        page: currentPage - 1,
        size: itemsPerPage,
        searchTerm: search,
        tagIds: +tag,
    });
    const { data: userTags } = useGetTagsQuery();

    const handleSizeChange = (size: number) => {
        setItemsPerPage(size);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleModal = (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        id: number,
        tags: number[]
    ) => {
        idRef.current = id;
        tagsRef.current = tags;
        e.stopPropagation();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8 w-full rounded-md border">
                <LoadingSpinner />
            </div>
        );
    }

    if (data && data.content.length > 0) {
        return (
            <div className={cn(!isMobile && "rounded-md border")}>
                <EditTagsDialog
                    open={editTagsDialogOpen}
                    onOpenChange={() => setEditTagsDialogOpen(false)}
                    id={idRef.current}
                />
                <DeleteDocumentDialog
                    open={deleteDocumentDialogOpen}
                    onOpenChange={() => setDeleteDocumentDialogOpen(false)}
                    id={idRef.current}
                />
                <EditDocumentDialog
                    open={editDocumentDialogOpen}
                    onOpenChange={() => setEditDocumentDialogOpen(false)}
                    id={idRef.current}
                    tags={tagsRef.current}
                />

                {isMobile ? (
                    <div className="p-2 space-y-4">
                        {data.content.map((item) => (
                            <Card key={item.id} className="overflow-hidden py-2">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-wrap gap-1 max-w-[80%]">
                                            {item.tags.length > 0 ? (
                                                <>
                                                    {item.tags.map((tag) => {
                                                        const color = userTags?.items.find(
                                                            (item) => item.id == tag.id
                                                        )?.hexString;

                                                        return (
                                                            <Badge
                                                                key={tag.id}
                                                                variant="secondary"
                                                                className="cursor-pointer text-white border-dashed px-1 text-xs"
                                                                style={{
                                                                    backgroundColor: color
                                                                        ? color
                                                                        : "black",
                                                                }}
                                                                onClick={(e) => {
                                                                    handleModal(
                                                                        e,
                                                                        item.id,
                                                                        item.tags.map((t) => t.id)
                                                                    );
                                                                    setEditTagsDialogOpen(true);
                                                                }}
                                                            >
                                                                {tag.name}
                                                            </Badge>
                                                        );
                                                    })}
                                                    <Badge
                                                        variant="outline"
                                                        className="cursor-pointer px-1 aspect-square border-dashed hover:border-black transition-all duration-200 text-xs"
                                                        onClick={(e) => {
                                                            handleModal(
                                                                e,
                                                                item.id,
                                                                item.tags.map((t) => t.id)
                                                            );
                                                            setEditTagsDialogOpen(true);
                                                        }}
                                                    >
                                                        +
                                                    </Badge>
                                                </>
                                            ) : (
                                                <Badge
                                                    variant="secondary"
                                                    className="cursor-pointer border-dashed px-1 text-xs"
                                                    onClick={(e) => {
                                                        handleModal(
                                                            e,
                                                            item.id,
                                                            item.tags.map((t) => t.id)
                                                        );
                                                        setEditTagsDialogOpen(true);
                                                    }}
                                                >
                                                    <Plus className="h-3 w-3 mr-1" />
                                                    Добавить тег
                                                </Badge>
                                            )}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            handleModal(
                                                                e,
                                                                item.id,
                                                                item.tags.map((t) => t.id)
                                                            );
                                                            setEditDocumentDialogOpen(true);
                                                        }}
                                                    >
                                                        Переименовать
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            handleModal(
                                                                e,
                                                                item.id,
                                                                item.tags.map((t) => t.id)
                                                            );
                                                            setDeleteDocumentDialogOpen(true);
                                                        }}
                                                    >
                                                        Удалить
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <h3 className="font-medium text-sm mb-3 line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <div className="flex gap-12 text-xs">
                                        <div className="flex flex-col gap-4 justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-muted-foreground">
                                                    Дата проверки:
                                                </span>
                                                <span>
                                                    {item.checkDate
                                                        ? formatDate(item.checkDate)
                                                        : "—"}
                                                </span>
                                            </div>

                                            <div className="flex items-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 text-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/dashboard/review/${item.id}`);
                                                    }}
                                                >
                                                    <Eye className="h-3 w-3 mr-1" />
                                                    Просмотр
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-muted-foreground">
                                                    Оригинальность:
                                                </span>
                                                {item.uniqueness >= 0 && (
                                                    <Badge
                                                        variant={
                                                            item.uniqueness >= 80
                                                                ? "default"
                                                                : item.uniqueness >= 50
                                                                  ? "secondary"
                                                                  : "outline"
                                                        }
                                                        className={`text-xs px-1 ${
                                                            item.uniqueness >= 80
                                                                ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                                                : item.uniqueness >= 50
                                                                  ? "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                                                                  : "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
                                                        }`}
                                                    >
                                                        {item.uniqueness}%
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex flex-col justify-end">
                                                <span className="text-muted-foreground">
                                                    Содержание ИИ:
                                                </span>
                                                <div className="flex items-center">
                                                    {item.aiLevel && item.aiLevel > 10 ? (
                                                        <AlertCircle className="mr-1 h-3 w-3 text-amber-500" />
                                                    ) : (
                                                        <CheckCircle className="mr-1 h-3 w-3 text-primary" />
                                                    )}
                                                    <span>{item.aiLevel}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    // Desktop table view
                    <Table>
                        <TableHeader>
                            <TableRow className="w-full">
                                <TableHead className="w-[10%] text-center">Дата проверки</TableHead>
                                <TableHead>Название документа</TableHead>
                                <TableHead className="w-[10%] text-center">Содержание ИИ</TableHead>
                                <TableHead className="w-[10%] text-center">
                                    Оригинальность
                                </TableHead>
                                <TableHead className="text-center w-[10%]">Отчет</TableHead>
                                <TableHead className="text-right w-[10%]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.content.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium text-center">
                                        {item.checkDate ? formatDate(item.checkDate) : null}
                                    </TableCell>
                                    <TableCell className="flex flex-col">
                                        <div className="flex flex-wrap gap-2 mb-1">
                                            {item.tags.length > 0 ? (
                                                <>
                                                    {item.tags.map((tag) => {
                                                        const color = userTags?.items.find(
                                                            (item) => item.id == tag.id
                                                        )?.hexString;

                                                        return (
                                                            <Badge
                                                                key={tag.id}
                                                                variant="secondary"
                                                                className="cursor-pointer text-white border-dashed px-1"
                                                                style={{
                                                                    backgroundColor: color
                                                                        ? color
                                                                        : "black",
                                                                }}
                                                                onClick={(e) => {
                                                                    handleModal(
                                                                        e,
                                                                        item.id,
                                                                        item.tags.map((t) => t.id)
                                                                    );
                                                                    setEditTagsDialogOpen(true);
                                                                }}
                                                            >
                                                                {tag.name}
                                                            </Badge>
                                                        );
                                                    })}
                                                    <Badge
                                                        variant="outline"
                                                        className="cursor-pointer px-1 aspect-square border-dashed hover:border-black hover:text-xl transition-all duration-200"
                                                        onClick={(e) => {
                                                            handleModal(
                                                                e,
                                                                item.id,
                                                                item.tags.map((t) => t.id)
                                                            );
                                                            setEditTagsDialogOpen(true);
                                                        }}
                                                    >
                                                        +
                                                    </Badge>
                                                </>
                                            ) : (
                                                <Badge
                                                    variant="secondary"
                                                    className="cursor-pointer border-dashed px-1"
                                                    onClick={(e) => {
                                                        handleModal(
                                                            e,
                                                            item.id,
                                                            item.tags.map((t) => t.id)
                                                        );
                                                        setEditTagsDialogOpen(true);
                                                    }}
                                                >
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Добавить тег
                                                </Badge>
                                            )}
                                        </div>
                                        <span className="line-clamp-1">{item.title}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center">
                                            {item.aiLevel && item.aiLevel > 10 ? (
                                                <AlertCircle className="mr-1 h-4 w-4 text-amber-500" />
                                            ) : (
                                                <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                                            )}
                                            <span>{item.aiLevel}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.uniqueness >= 0 && (
                                            <Badge
                                                variant={
                                                    item.uniqueness >= 80
                                                        ? "default"
                                                        : item.uniqueness >= 50
                                                          ? "secondary"
                                                          : "outline"
                                                }
                                                className={
                                                    item.uniqueness >= 80
                                                        ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                                        : item.uniqueness >= 50
                                                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                                                          : "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
                                                }
                                            >
                                                {item.uniqueness}%
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/dashboard/review/${item.id}`);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">Просмотр</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost">...</Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-40">
                                                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            handleModal(
                                                                e,
                                                                item.id,
                                                                item.tags.map((t) => t.id)
                                                            );
                                                            setEditDocumentDialogOpen(true);
                                                        }}
                                                    >
                                                        Переименовать
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            handleModal(
                                                                e,
                                                                item.id,
                                                                item.tags.map((t) => t.id)
                                                            );
                                                            setDeleteDocumentDialogOpen(true);
                                                        }}
                                                    >
                                                        Удалить
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                <TablePagination
                    currentPage={currentPage}
                    pageSize={itemsPerPage}
                    totalItems={data?.totalElements || 0}
                    onPageSizeChangeAction={handleSizeChange}
                    onPageChangeAction={handlePageChange}
                />
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <div className="w-full py-4 flex justify-center">Документы отсутствуют!</div>
        </div>
    );
}
