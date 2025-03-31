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

interface EditTagsFormProps {
    onOpenChange: () => void;
}

interface Option {
    id: number;
    name: string;
    color: string;
}

const options: Option[] = [
    { id: 1, name: "test1", color: "#432" },
    { id: 2, name: "test2", color: "#432" },
    { id: 3, name: "test3", color: "#432" },
    { id: 4, name: "test4", color: "#432" },
    { id: 5, name: "test5", color: "#432" },
    { id: 6, name: "test6", color: "#432" },
    { id: 7, name: "test7", color: "#432" },
    { id: 8, name: "test8", color: "#432" },
    { id: 9, name: "test9", color: "#432" },
];

const EditTagsForm: React.FC<EditTagsFormProps> = ({ onOpenChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState<Option[]>([]);
    const [search, setSearch] = useState<string>("");

    const filteredOptions = options.filter(
        (option) =>
            option.name.includes(search) || option.color.includes(search)
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
            const isAlreadySelected = prevSelected.some(
                (option) => option.id === index
            );

            let newSelected;
            if (isAlreadySelected) {
                newSelected = prevSelected.filter(
                    (option) => option.id !== index
                );
            } else {
                const item = options.find((option) => option.id === index);
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
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Поиск..."
                            className="w-full bg-background pl-8"
                            onChange={(e) =>
                                setSearch(e.target.value.trim().toLowerCase())
                            }
                        />
                    </div>
                    <ScrollArea className="h-40 my-2">
                        {filteredOptions.map((option) => (
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
                                            backgroundColor: option.color,
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </ScrollArea>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setSelected([])}>
                        Очистить теги
                    </Button>
                    <Button disabled={isLoading} type="submit">
                        Save changes
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default EditTagsForm;
