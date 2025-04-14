import React, { useEffect, useState } from "react";
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
import { tagsApi, useGetDocumentTagsQuery, useGetTagsQuery } from "@/api/tagsApi";
import { ErrorHandler } from "@/api/store.ts";
import { useDispatch } from "react-redux";
import { useEditDocumentTagsMutation } from "@/api/documentApi";

interface EditTagsFormProps {
    id: number;
    onOpenChange: () => void;
}

const EditTagsForm: React.FC<EditTagsFormProps> = ({ id, onOpenChange }) => {
    const [search, setSearch] = useState<string>("");
    const dispatch = useDispatch();

    const { data: allTags } = useGetTagsQuery({ userId: 1 });
    const { data: documentTags, isLoading: isDocumentLoading } = useGetDocumentTagsQuery({
        userId: 1,
        id: id,
    });
    const [editDocuments, { isLoading }] = useEditDocumentTagsMutation();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            tags: [],
        },
    });

    useEffect(() => {
        if (documentTags?.items) {
            form.reset({
                tags: documentTags.items.map((item) => item.id),
            });
        }
    }, [documentTags, form]);

    const filteredTags = allTags?.items.filter(
        (tag) =>
            tag.name.toLowerCase().includes(search.trim().toLowerCase()) ||
            tag.hexString.toLowerCase().includes(search.trim().toLowerCase())
    );

    // Обработка отправки формы
    const handleSubmit = async (values: z.infer<typeof schema>) => {
        try {
            await editDocuments({
                userId: 1,
                id: id,
                tagsIds: values.tags,
            }).unwrap();
            toast.success("Изменения успешно применены!");
            dispatch(tagsApi.util.invalidateTags(["UpdateExactTags"]));
        } catch (error) {
            toast.error(`Ошибка: ${(error as ErrorHandler).data?.error || "Unknown error"}`);
        } finally {
            onOpenChange();
        }
    };

    // Переключение тегов
    const toggleTag = (tagId: number) => {
        const currentTags = form.getValues("tags");
        const newTags = currentTags.includes(tagId)
            ? currentTags.filter((id) => id !== tagId)
            : [...currentTags, tagId];

        form.setValue("tags", newTags, { shouldDirty: true });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <div className={`relative ${isDocumentLoading ? "blur-sm" : ""}`}>
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Поиск..."
                            className="w-full bg-background pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <ScrollArea className="h-40 my-2">
                        {filteredTags?.map((tag) => (
                            <Card
                                key={tag.id}
                                onClick={() => toggleTag(tag.id)}
                                className={cn(
                                    "my-2 p-0 cursor-pointer rounded-md transition-all",
                                    form.watch("tags").includes(tag.id)
                                        ? "bg-blue-50 border-blue-200"
                                        : "hover:bg-gray-50"
                                )}
                            >
                                <CardContent className="flex px-4 py-1 justify-between items-center">
                                    <CardDescription className="text-black">
                                        {tag.name}
                                    </CardDescription>
                                    <div
                                        className="h-6 w-6 rounded-md border"
                                        style={{ backgroundColor: tag.hexString }}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </ScrollArea>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="submit"
                        variant="outline"
                        onClick={() => form.reset({ tags: [] })}
                    >
                        Очистить
                    </Button>
                    <Button type="submit" disabled={isLoading || isDocumentLoading}>
                        {isLoading ? "Сохранение..." : "Сохранить"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default EditTagsForm;
