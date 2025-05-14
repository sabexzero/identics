import React, { useRef, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { TablePagination } from "@/components/tables/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";

interface HistoryTableProps {
    search: string;
    tag: string;
}

export default function HistoryTable({ search, tag }: HistoryTableProps) {
    const navigate = useNavigate();
    const idRef = useRef<number>(null!);

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

    const handleModal = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, id: number) => {
        idRef.current = id;
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
                        {data.content.map((item) => (
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
                                                            onClick={(e) => {
                                                                handleModal(e, item.id);
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
                                                        handleModal(e, item.id);
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
                                                    handleModal(e, item.id);
                                                    setEditTagsDialogOpen(true);
                                                }}
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
                                                        onClick={(e) => {
                                                            handleModal(e, item.id);
                                                            setEditDocumentDialogOpen(true);
                                                        }}
                                                    >
                                                        Переименовать
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            handleModal(e, item.id);
                                                            setDeleteDocumentDialogOpen(true);
                                                        }}
                                                    >
                                                        Удалить
                                                    </DropdownMenuItem>
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
