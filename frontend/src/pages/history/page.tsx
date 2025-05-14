import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import HistoryTable from "@/components/tables/history";
import { useDebounce } from "use-debounce";
import { useGetTagsQuery } from "@/api/tagsApi";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function HistoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("");

    const [search] = useDebounce(searchQuery, 500);

    const { data: tags } = useGetTagsQuery();

    return (
        <div className="grid gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">История проверок</h1>
                    <p className="text-muted-foreground">
                        Просмотр всех ваших проверок на плагиат.
                    </p>
                </div>

                <div className="flex gap-2 sm:gap-4">
                    <div className="relative w-full md:w-64">
                        <Select value={selectedTag} onValueChange={setSelectedTag}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Поиск по тегам..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={null!}>Все</SelectItem>
                                    {tags?.items.map((tag) => (
                                        <SelectItem key={tag.id} value={tag.id.toString()}>
                                            {tag.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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
            </div>

            <HistoryTable tag={selectedTag} search={search} />
        </div>
    );
}
