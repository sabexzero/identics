import React, { useState } from "react";
import { Form } from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { schema } from "@/components/forms/history/edit-tags/schema.ts";
import { Card, CardContent, CardDescription } from "@/components/ui/card.tsx";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { cn } from "@/lib/utils";
import { useGetTagsQuery } from "@/api/tagsApi";
import { ITagsResponse } from "@/api/tagsApi/types.ts";

interface EditTagsFormProps {
    onOpenChange: () => void;
}

const EditTagsForm: React.FC<EditTagsFormProps> = ({ onOpenChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState<ITagsResponse[]>([]);
    const [search, setSearch] = useState<string>("");
    const { data } = useGetTagsQuery({ userId: 1 });

    const filteredOptions = data?.items.filter(
        (option) => option.name.includes(search) || option.hexString.includes(search)
    );

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            tags: [],
        },
    });

    function onSubmit(values: z.infer<typeof schema>) {
        console.log(values);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onOpenChange();
            toast("Изменения успешно применены!");
        }, 1000);
    }

    const handleSelect = (index: number) => {
        setSelected((prevSelected) => {
            const isAlreadySelected = prevSelected.some((option) => option.id === index);

            let newSelected;
            if (isAlreadySelected) {
                newSelected = prevSelected.filter((option) => option.id !== index);
            } else {
                const item = data?.items.find((option) => option.id === index);
                newSelected = item ? [...prevSelected, item] : prevSelected;
            }

            form.setValue(
                "tags",
                newSelected.map((item) => item.id)
            );

            return newSelected;
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Поиск..."
                            className="w-full bg-background pl-8"
                            onChange={(e) => setSearch(e.target.value.trim().toLowerCase())}
                        />
                    </div>
                    <ScrollArea className="h-40 my-2">
                        {filteredOptions?.map((option) => (
                            <Card
                                className={cn(
                                    "my-2 p-0 cursor-pointer rounded-md",
                                    "transition-all duration-200 last:mb-0",
                                    `${selected.find((item) => item.id === option.id) ? "bg-[#EFF6FF]" : "hover:bg-[#f3f4f6]"}`
                                )}
                                key={option.id}
                                onClick={() => handleSelect(option.id)}
                            >
                                <CardContent className="flex px-4 py-1 justify-between items-center">
                                    <CardDescription className="text-black">
                                        {option.name}
                                    </CardDescription>
                                    <div
                                        className="h-6 w-6 rounded-md"
                                        style={{
                                            backgroundColor: option.hexString,
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </ScrollArea>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setSelected([])}>Очистить теги</Button>
                    <Button disabled={isLoading} type="submit">
                        Сохранить изменения
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default EditTagsForm;
