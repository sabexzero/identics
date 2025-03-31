import React, { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form.tsx";
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

interface CreateTagsFormProps {
    onOpenChange: () => void;
}

const CreateTagsForm: React.FC<CreateTagsFormProps> = ({ onOpenChange }) => {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            color: "#000000",
        },
    });

    const nameValue = form.watch("name");
    const colorValue = form.watch("color");

    function onSubmit(values: z.infer<typeof schema>) {
        console.log(values);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onOpenChange();
            toast("Изменения успешно применены!");
        }, 1000);
    }

    console.log(colorValue);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
            >
                <div className="flex items-end gap-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <Label htmlFor="name">Название</Label>
                                <FormMessage />
                                <FormControl>
                                    <Input
                                        id="name"
                                        disabled={isLoading}
                                        {...field}
                                    />
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
                                    <ColorPicker
                                        id="color"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {nameValue.length > 0 && (
                    <div className="flex items-center justify-center py-4">
                        <Badge
                            style={{
                                backgroundColor: colorValue,
                                minHeight: 32,
                                fontSize: "2rem",
                            }}
                        >
                            {nameValue}
                        </Badge>
                    </div>
                )}

                <Button type="submit">Save changes</Button>
            </form>
        </Form>
    );
};

export default CreateTagsForm;
