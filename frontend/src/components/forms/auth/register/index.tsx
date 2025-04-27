import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { schema } from "@/components/forms/auth/register/schema.ts";
import { useRegisterMutation } from "@/api/authApi";
import { toast } from "sonner";

export default function RegisterForm() {
    const navigate = useNavigate();

    const [register, { isLoading }] = useRegisterMutation();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: z.infer<typeof schema>) {
        try {
            register({
                email: values.email,
                name: values.name,
                password: values.password,
            })
                .unwrap()
                .then((result) => {
                    if (result.accessToken) {
                        localStorage.setItem("accessToken", result.accessToken);
                        navigate("/dashboard");
                        toast.success("Вы успешно зарегистрировались!");
                    }
                });
        } catch (error) {
            toast.error("Возникла ошибка при регистрации...");
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="name">Имя</Label>
                            <FormControl>
                                <Input
                                    id="name"
                                    placeholder="Иван Иванов"
                                    autoComplete="name"
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
                            <Label htmlFor="password">Пароль</Label>
                            <FormControl>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
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
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="confirmPassword">Подтверждение пароля</Label>
                            <FormControl>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Создание аккаунта...
                        </>
                    ) : (
                        "Создать аккаунт"
                    )}
                </Button>
            </form>
        </Form>
    );
}
