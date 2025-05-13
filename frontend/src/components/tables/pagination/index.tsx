import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type TablePaginationProps = {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    pageSizeOptions?: number[];
    maxPageButtons?: number;
    onPageChangeAction: (page: number) => void;
    onPageSizeChangeAction: (pageSize: number) => void;
    labels?: {
        itemsPerPage?: string;
        showing?: string;
        of?: string;
        items?: string;
    };
};

export function TablePagination({
    totalItems,
    currentPage,
    pageSize,
    pageSizeOptions = [5, 10, 15, 20],
    maxPageButtons = 5,
    onPageChangeAction,
    onPageSizeChangeAction,
    labels = {
        itemsPerPage: "Записей на странице:",
        showing: "Показано",
        of: "из",
        items: "записей",
    },
}: TablePaginationProps) {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        onPageChangeAction(page);
    };

    const getPageButtons = () => {
        const buttons = [];
        const sideButtons = maxPageButtons - 2;

        buttons.push(
            <Button
                key="page-1"
                variant={currentPage === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(1)}
                className="w-8 h-8 p-0"
            >
                1
            </Button>
        );

        if (totalPages <= 1) return buttons;

        let startPage = Math.max(2, currentPage - Math.floor(sideButtons / 2));
        const endPage = Math.min(totalPages - 1, startPage + sideButtons - 1);

        if (endPage === totalPages - 1) {
            startPage = Math.max(2, endPage - sideButtons + 1);
        }

        if (startPage > 2) {
            buttons.push(
                <Button
                    key="ellipsis-left"
                    variant="outline"
                    size="sm"
                    disabled
                    className="w-8 h-8 p-0"
                >
                    ...
                </Button>
            );
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <Button
                    key={`page-${i}`}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i)}
                    className="w-8 h-8 p-0"
                >
                    {i}
                </Button>
            );
        }

        if (endPage < totalPages - 1) {
            buttons.push(
                <Button
                    key="ellipsis-right"
                    variant="outline"
                    size="sm"
                    disabled
                    className="w-8 h-8 p-0"
                >
                    ...
                </Button>
            );
        }

        buttons.push(
            <Button
                key={`page-${totalPages}`}
                variant={currentPage === totalPages ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                className="w-8 h-8 p-0"
            >
                {totalPages}
            </Button>
        );

        return buttons;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t gap-4">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{labels.itemsPerPage}</span>
                <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => onPageSizeChangeAction(Number(value))}
                >
                    <SelectTrigger className="w-[70px] h-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {pageSizeOptions.map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="text-sm text-muted-foreground">
                {labels.showing} {startItem}-{endItem} {labels.of} {totalItems} {labels.items}
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="hidden sm:flex space-x-2">{getPageButtons()}</div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
