import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form.tsx";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { schema } from "@/components/forms/auth/login/schema.ts";

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof schema>) {
        console.log(values);
        setIsLoading(true);
        // Имитация входа - в реальном приложении здесь будет вызов вашего бэкенда
        setTimeout(() => {
            setIsLoading(false);
            navigate("/dashboard");
        }, 1000);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="email">Email</Label>
                            <FormControl>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Пароль</Label>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Забыли пароль?
                                </a>
                            </div>
                            <FormControl>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Вход...
                        </>
                    ) : (
                        "Войти"
                    )}
                </Button>
            </form>
        </Form>
    );
}
