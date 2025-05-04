import { useForm } from "react-hook-form";
import * as z from "zod";
import { schema } from "@/components/forms/history/documents/edit/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useEditDocumentMutation } from "@/api/documentApi";
import { toast } from "sonner";
import { ErrorHandler, RootState } from "@/api/store.ts";
import { DialogFooter } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AnimatedDialogWrapper } from "@/components/ui/animated-dialog.tsx";
import { useSelector } from "react-redux";

interface EditDocumentFormProps {
    id: number;
    tagsIds?: number[];
    onOpenChange: () => void;
}

export default function EditDocumentForm({
    id,
    onOpenChange,
    tagsIds = [],
}: EditDocumentFormProps) {
    const [editDocument, { isLoading }] = useEditDocumentMutation();
    const userId = useSelector((state: RootState) => state.user.userId);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            tags: [],
        },
    });

    const onSubmit = async (values: z.infer<typeof schema>) => {
        try {
            await editDocument({
                userId: userId!,
                id: id,
                tagsIds: tagsIds,
                title: values.title,
            });

            toast.success("Документ успешно удален!");
        } catch (error) {
            toast.error(
                `Возникла ошибка при удалении документа: ${(error as ErrorHandler).data.error}`
            );
        }
    };

    return (
        <Form {...form}>
            <AnimatedDialogWrapper timing={1}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <Label htmlFor="title">Название</Label>
                                <FormControl>
                                    <Input
                                        id="title"
                                        type="text"
                                        autoComplete="email"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </AnimatedDialogWrapper>

            <AnimatedDialogWrapper timing={2}>
                <DialogFooter className="mt-4">
                    <Button onClick={onOpenChange} variant="outline">
                        Отмена
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Сохранение..." : "Сохранить изменения"}
                    </Button>
                </DialogFooter>
            </AnimatedDialogWrapper>
        </Form>
    );
}
