import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form.tsx";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { schema } from "@/components/forms/auth/login/schema.ts";
import { useLoginMutation } from "@/api/authApi";
import { toast } from "sonner";

export default function LoginForm() {
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleSubmit = async (values: z.infer<typeof schema>) => {
        console.log("[1] Начало handleSubmit");
        try {
            console.log("[2] Пытаемся отправить запрос");
            const result = await login({
                login: values.email,
                password: values.password,
            }).unwrap();

            console.log("[3] Токен получен:", result.accessToken);
            localStorage.setItem("accessToken", result.accessToken);

            console.log("[4] Переходим на /dashboard");
            navigate("/dashboard");

            console.log("[5] Показываем toast");
            toast.success("Вы авторизировались!");
        } catch (error) {
            console.error("[ERROR]", error);
            toast.error("Ошибка авторизации");
        }
        console.log("[6] Конец handleSubmit");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="login">Email</Label>
                            <FormControl>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@gmail.com"
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
