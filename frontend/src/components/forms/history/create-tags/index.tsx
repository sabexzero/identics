import React from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColorPicker } from "@/components/ui/color-picker.tsx";
import { schema } from "@/components/forms/history/create-tags/schema.ts";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { toast } from "sonner";
import { useCreateTagMutation } from "@/api/tagsApi";
import { ErrorHandler } from "@/api/store.ts";

const CreateTagsForm: React.FC = () => {
    const [createTagMutation, { isLoading }] = useCreateTagMutation();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            color: "#000000",
        },
    });

    const nameValue = form.watch("name");
    const colorValue = form.watch("color");

    const onSubmit = async (values: z.infer<typeof schema>) => {
        console.log(values);
        try {
            await createTagMutation({
                userId: 1,
                name: values.name,
                hexString: values.color,
            });

            toast.success("Новый тег успешно создан!");
        } catch (error) {
            toast.error(`При создании возникла ошибка: ${(error as ErrorHandler).data.error}`);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                <div className="flex items-end gap-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <Label htmlFor="name">Название</Label>
                                <FormMessage />
                                <FormControl>
                                    <Input id="name" disabled={isLoading} {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ColorPicker id="color" disabled={isLoading} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div
                    style={{
                        maxHeight: nameValue.length > 0 ? "100px" : "0px",
                        opacity: nameValue.length > 0 ? 1 : 0,
                        paddingTop: nameValue.length > 0 ? "1rem" : "0",
                        paddingBottom: nameValue.length > 0 ? "1rem" : "0",
                        transition: "all 0.3s ease",
                    }}
                    className="flex items-center justify-center overflow-hidden"
                >
                    <Badge
                        style={{
                            backgroundColor: nameValue.length > 0 ? colorValue : "white",
                            minHeight: 32,
                            fontSize: "2rem",
                            transform: nameValue.length > 0 ? "scale(1)" : "scale(0)",
                            transition: "transform 0.2s ease 0.1s",
                        }}
                    >
                        {nameValue}
                    </Badge>
                </div>

                <Button type="submit">Сохранить изменения</Button>
            </form>
        </Form>
    );
};

export default CreateTagsForm;
