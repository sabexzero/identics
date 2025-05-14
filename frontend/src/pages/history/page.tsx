import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import HistoryTable from "@/components/tables/history";
import { useDebounce } from "use-debounce";

export default function HistoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [search] = useDebounce(searchQuery, 500);

    return (
        <div className="grid gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">История проверок</h1>
                    <p className="text-muted-foreground">
                        Просмотр всех ваших проверок на плагиат.
                    </p>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Поиск по документам..."
                        className="w-full pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <HistoryTable search={search} />
        </div>
    );
}
