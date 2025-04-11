import React, { useState } from "react";
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
import { useGetPaginationContentQuery } from "@/api/contentApi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditTagsDialog from "@/components/dialogs/history";

export function HistoryTable() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(5);

    const [editTagsDialogOpen, setEditTagsDialogOpen] = useState(false);

    const { data } = useGetPaginationContentQuery({
        userId: 1,
        page: currentPage - 1,
        perPage: itemsPerPage,
        folderId: 1,
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
                <PaginationLink
                    isActive={currentPage === 1}
                    onClick={() => handlePageClick(1)}
                >
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
                    <PaginationLink
                        isActive={currentPage === i}
                        onClick={() => handlePageClick(i)}
                    >
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

    const handleEditTags = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.stopPropagation();
        setEditTagsDialogOpen(true);
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <EditTagsDialog
                    open={editTagsDialogOpen}
                    onOpenChange={() => setEditTagsDialogOpen(false)}
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">
                                Дата проверки
                            </TableHead>
                            <TableHead>Название документа</TableHead>
                            <TableHead className="w-[150px] text-center">
                                Содержание ИИ текста
                            </TableHead>
                            <TableHead className="w-[150px] text-center">
                                Оригинальность
                            </TableHead>
                            <TableHead className="w-[120px] text-right">
                                Отчет
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.content?.length > 0 ? (
                            data.content.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className="hover:bg-muted/50"
                                >
                                    <TableCell className="font-medium">
                                        {item.dateTime}
                                    </TableCell>
                                    <TableCell className="flex flex-col">
                                        <div className="flex gap-2">
                                            {/*<Badge*/}
                                            {/*    variant="default"*/}
                                            {/*    className="bg-green-800"*/}
                                            {/*>*/}
                                            {/*    ПРИб-221*/}
                                            {/*</Badge>*/}
                                            <Badge
                                                variant="secondary"
                                                className="cursor-pointer border-dashed px-1"
                                                onClick={handleEditTags}
                                            >
                                                <Plus />
                                                Добавить тег
                                            </Badge>
                                        </div>
                                        {item.title}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center">
                                            {item.aiCheckLevel &&
                                            item.aiCheckLevel > 10 ? (
                                                <AlertCircle className="mr-1 h-4 w-4 text-amber-500" />
                                            ) : (
                                                <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                                            )}
                                            <span>{item.aiCheckLevel}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item.plagiarismLevel && (
                                            <Badge
                                                variant={
                                                    item.plagiarismLevel >= 90
                                                        ? "default"
                                                        : item.plagiarismLevel >=
                                                            80
                                                          ? "secondary"
                                                          : "outline"
                                                }
                                                className={
                                                    item.plagiarismLevel >= 90
                                                        ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                                        : item.plagiarismLevel >=
                                                            80
                                                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                                                          : "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
                                                }
                                            >
                                                {item.plagiarismLevel}%
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(
                                                        `/dashboard/review/${item.id}`
                                                    );
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Просмотр
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log(
                                                        `Скачивание отчета ${item.id}`
                                                    );
                                                }}
                                            >
                                                <Download className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Скачать
                                                </span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost">
                                                    ...
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-40">
                                                <DropdownMenuLabel>
                                                    Действия
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuGroup>
                                                    <DropdownMenuItem>
                                                        Переименовать
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        Удалить
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="h-24 text-center"
                                >
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
                            className={
                                currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }
                        />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                        <PaginationNext
                            onClick={handleNextPage}
                            className={
                                currentPage === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
