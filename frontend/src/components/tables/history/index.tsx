import React, { useRef, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Download, Eye, Plus } from "lucide-react";
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
import { formatDate } from "@/lib/utils.ts";

export default function HistoryTable() {
    const navigate = useNavigate();
    const idRef = useRef<number>(null!);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(5);

    const [editTagsDialogOpen, setEditTagsDialogOpen] = useState<boolean>(false);
    const [deleteDocumentDialogOpen, setDeleteDocumentDialogOpen] = useState<boolean>(false);
    const [editDocumentDialogOpen, setEditDocumentDialogOpen] = useState<boolean>(false);

    const { data } = useGetDocumentsQuery({
        userId: 1,
        page: currentPage - 1,
        size: itemsPerPage,
    });
    const { data: userTags } = useGetTagsQuery({
        userId: 1,
    });

    const totalPages = data?.totalPages || 0;

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    const renderPaginationItems = () => {
        const items = [];

        items.push(
            <PaginationItem key="page-1">
                <PaginationLink isActive={currentPage === 1} onClick={() => handlePageClick(1)}>
                    1
                </PaginationLink>
            </PaginationItem>
        );

        if (currentPage > 3) {
            items.push(
                <PaginationItem key="ellipsis-1">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            if (i === 1 || i === totalPages) continue;

            items.push(
                <PaginationItem key={`page-${i}`}>
                    <PaginationLink isActive={currentPage === i} onClick={() => handlePageClick(i)}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (currentPage < totalPages - 2) {
            items.push(
                <PaginationItem key="ellipsis-2">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        if (totalPages > 1) {
            items.push(
                <PaginationItem key={`page-${totalPages}`}>
                    <PaginationLink
                        isActive={currentPage === totalPages}
                        onClick={() => handlePageClick(totalPages)}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    const handleEditTags = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: number) => {
        idRef.current = id;
        e.stopPropagation();
        setEditTagsDialogOpen(true);
    };

    const handleDeleteDocument = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: number) => {
        idRef.current = id;
        e.stopPropagation();
        setDeleteDocumentDialogOpen(true);
    };

    const handleEditDocument = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: number) => {
        idRef.current = id;
        e.stopPropagation();
        setEditDocumentDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
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
                />

                <Table>
                    <TableHeader>
                        <TableRow className="w-full">
                            <TableHead className="w-[10%] text-center">Дата проверки</TableHead>
                            <TableHead>Название документа</TableHead>
                            <TableHead className="w-[10%] text-center">Содержание ИИ</TableHead>
                            <TableHead className="w-[10%] text-center">Оригинальность</TableHead>
                            <TableHead className="text-center w-[10%]">Отчет</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.content?.length > 0 ? (
                            data.content.map((item) => (
                                <TableRow key={item.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium text-center">
                                        {item.checkDate ? formatDate(item.checkDate) : null}
                                    </TableCell>
                                    <TableCell className="flex flex-col">
                                        <div className="flex gap-2">
                                            {item.tags.length > 0 ? (
                                                <>
                                                    {item.tags.map((tag) => {
                                                        const color = userTags?.items.find(
                                                            (item) => item.id == tag.id
                                                        )?.hexString;

                                                        return (
                                                            <Badge
                                                                variant="secondary"
                                                                className="cursor-pointer text-white border-dashed px-1"
                                                                style={{
                                                                    backgroundColor: color
                                                                        ? color
                                                                        : "black",
                                                                }}
                                                                onClick={(e) =>
                                                                    handleEditTags(e, item.id)
                                                                }
                                                            >
                                                                {tag.name}
                                                            </Badge>
                                                        );
                                                    })}
                                                    <Badge
                                                        variant="outline"
                                                        className="cursor-pointer px-1 aspect-square border-dashed hover:border-black hover:text-xl transition-all duration-200"
                                                        onClick={(e) => handleEditTags(e, item.id)}
                                                    >
                                                        +
                                                    </Badge>
                                                </>
                                            ) : (
                                                <Badge
                                                    variant="secondary"
                                                    className="cursor-pointer border-dashed px-1"
                                                    onClick={(e) => handleEditTags(e, item.id)}
                                                >
                                                    <Plus />
                                                    Добавить тег
                                                </Badge>
                                            )}
                                        </div>
                                        {item.title}
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
                                        {item.uniqueness && (
                                            <Badge
                                                variant={
                                                    item.uniqueness >= 90
                                                        ? "default"
                                                        : item.uniqueness >= 80
                                                          ? "secondary"
                                                          : "outline"
                                                }
                                                className={
                                                    item.uniqueness >= 90
                                                        ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                                        : item.uniqueness >= 80
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
                                            <Button variant="ghost" size="icon">
                                                <a href={item.reportUrl} target="_blank">
                                                    <Download className="h-4 w-4" />
                                                    <span className="sr-only">Скачать</span>
                                                </a>
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost">...</Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-40">
                                                    <DropdownMenuLabel>Действия</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem
                                                            onClick={(e) =>
                                                                handleEditDocument(e, item.id)
                                                            }
                                                        >
                                                            Переименовать
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={(e) =>
                                                                handleDeleteDocument(e, item.id)
                                                            }
                                                        >
                                                            Удалить
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Документы не найдены.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={handlePreviousPage}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                        <PaginationNext
                            onClick={handleNextPage}
                            className={
                                currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
