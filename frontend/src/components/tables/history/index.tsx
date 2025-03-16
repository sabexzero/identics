import { useState } from "react";
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
import { AlertCircle, CheckCircle, Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface HistoryTableProps {
    searchQuery: string;
}

// Моковые данные для истории проверок
const historyData = [
    {
        id: "doc-1",
        date: "16.03.2025",
        title: "Введение к научной работе",
        aiContent: 5,
        originality: 88,
    },
    {
        id: "doc-2",
        date: "15.03.2025",
        title: "Обзор литературы",
        aiContent: 15,
        originality: 72,
    },
    {
        id: "doc-3",
        date: "14.03.2025",
        title: "Методология исследования",
        aiContent: 0,
        originality: 95,
    },
    {
        id: "doc-4",
        date: "13.03.2025",
        title: "Результаты эксперимента",
        aiContent: 8,
        originality: 90,
    },
    {
        id: "doc-5",
        date: "12.03.2025",
        title: "Анализ данных",
        aiContent: 12,
        originality: 85,
    },
    {
        id: "doc-6",
        date: "11.03.2025",
        title: "Заключение",
        aiContent: 20,
        originality: 75,
    },
    {
        id: "doc-7",
        date: "10.03.2025",
        title: "Приложение А",
        aiContent: 0,
        originality: 100,
    },
    {
        id: "doc-8",
        date: "09.03.2025",
        title: "Приложение Б",
        aiContent: 3,
        originality: 97,
    },
    {
        id: "doc-9",
        date: "08.03.2025",
        title: "Библиография",
        aiContent: 0,
        originality: 100,
    },
    {
        id: "doc-10",
        date: "07.03.2025",
        title: "Аннотация",
        aiContent: 25,
        originality: 70,
    },
    {
        id: "doc-11",
        date: "06.03.2025",
        title: "Глава 1",
        aiContent: 10,
        originality: 82,
    },
    {
        id: "doc-12",
        date: "05.03.2025",
        title: "Глава 2",
        aiContent: 7,
        originality: 88,
    },
];

export function HistoryTable({ searchQuery }: HistoryTableProps) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Фильтрация данных по поисковому запросу
    const filteredData = historyData.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Пагинация
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    // Обработчики пагинации
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

    // Генерация элементов пагинации
    const renderPaginationItems = () => {
        const items = [];

        // Всегда показываем первую страницу
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

        // Если текущая страница > 3, показываем многоточие после первой страницы
        if (currentPage > 3) {
            items.push(
                <PaginationItem key="ellipsis-1">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Показываем страницы вокруг текущей
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            if (i === 1 || i === totalPages) continue; // Пропускаем первую и последнюю страницы, они добавляются отдельно

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

        // Если текущая страница < totalPages - 2, показываем многоточие перед последней страницей
        if (currentPage < totalPages - 2) {
            items.push(
                <PaginationItem key="ellipsis-2">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Всегда показываем последнюю страницу, если страниц больше 1
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

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
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
                        {paginatedData.length > 0 ? (
                            paginatedData.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() =>
                                        navigate(`/dashboard/review/${item.id}`)
                                    }
                                >
                                    <TableCell className="font-medium">
                                        {item.date}
                                    </TableCell>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center">
                                            {item.aiContent > 10 ? (
                                                <AlertCircle className="mr-1 h-4 w-4 text-amber-500" />
                                            ) : (
                                                <CheckCircle className="mr-1 h-4 w-4 text-primary" />
                                            )}
                                            <span>{item.aiContent}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant={
                                                item.originality >= 90
                                                    ? "default"
                                                    : item.originality >= 80
                                                      ? "secondary"
                                                      : "outline"
                                            }
                                            className={
                                                item.originality >= 90
                                                    ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                                                    : item.originality >= 80
                                                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                                                      : "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
                                            }
                                        >
                                            {item.originality}%
                                        </Badge>
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
                                                    // Здесь будет логика скачивания отчета
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

            {filteredData.length > itemsPerPage && (
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
            )}
        </div>
    );
}
