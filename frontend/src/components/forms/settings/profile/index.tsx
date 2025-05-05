"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/components/forms/settings/profile/schema";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, LogOut, UserX, Upload, Check, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useLogoutMutation } from "@/api/authApi";
import { useNavigate } from "react-router-dom";

const ProfileSettings: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "Владислав Петров",
            email: "vladislavPetrov@example.com",
            phone: "+7 (999) 999 99 99",
        },
    });

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.clear();
            navigate("/auth");
        } catch (error) {
            console.error(error);
            toast.error("Возникла ошибка при выходе из аккаунта");
        }
    };

    const onSubmit = (data: z.infer<typeof schema>) => {
        setIsSubmitting(true);
        console.log(data);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        }, 1000);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="space-y-6">
            <Card className="border border-primary/10 shadow-lg shadow-primary/5 overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                                    {getInitials(form.getValues().name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Upload className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">Профиль</CardTitle>
                            <CardDescription className="text-base">
                                Управление личной информацией и настройками аккаунта
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pb-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <Label
                                                htmlFor="name"
                                                className="flex items-center gap-2 text-base font-medium"
                                            >
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                ФИО
                                            </Label>
                                            <FormControl>
                                                <Input
                                                    id="name"
                                                    {...field}
                                                    className="h-11 px-4 transition-all border-muted-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary"
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
                                        <FormItem className="space-y-2">
                                            <Label
                                                htmlFor="email"
                                                className="flex items-center gap-2 text-base font-medium"
                                            >
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                Email адрес
                                            </Label>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    {...field}
                                                    className="h-11 px-4 transition-all border-muted-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <Label
                                                htmlFor="phone"
                                                className="flex items-center gap-2 text-base font-medium"
                                            >
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                Номер телефона
                                            </Label>
                                            <FormControl>
                                                <Input
                                                    id="phone"
                                                    {...field}
                                                    className="h-11 px-4 transition-all border-muted-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="h-11 px-6 w-full md:w-auto relative overflow-hidden"
                                    disabled={isSubmitting || isSuccess}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Сохранение...
                                        </>
                                    ) : isSuccess ? (
                                        <>
                                            <Check className="h-4 w-4 mr-2" />
                                            Сохранено!
                                        </>
                                    ) : (
                                        "Сохранить изменения"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="border border-destructive/10 shadow-lg shadow-destructive/5">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold">Действия с аккаунтом</CardTitle>
                    <CardDescription>
                        Будьте осторожны с этими действиями — некоторые из них необратимы
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                    <div className="space-y-3">
                        <div className="p-4 rounded-lg border border-muted-foreground/10 bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-muted-foreground/10">
                                        <LogOut className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Выйти со всех устройств</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Завершить все активные сессии кроме текущей
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    Выйти
                                </Button>
                            </div>
                        </div>

                        <Separator className="my-2" />

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <div className="p-4 rounded-lg border border-destructive/10 bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-destructive/10">
                                                <UserX className="h-5 w-5 text-destructive" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">Удалить аккаунт</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Удалить аккаунт и все связанные данные
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="destructive" size="sm">
                                            Удалить
                                        </Button>
                                    </div>
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Вы действительно хотите удалить аккаунт?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Это действие полностью удалит ваш аккаунт и все данные. Это
                                        действие необратимо.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                                    <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/65">
                                        Удалить аккаунт
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
                <CardFooter className="py-3 text-xs text-muted-foreground italic">
                    Удаление аккаунта приведет к потере всех данных и не может быть отменено
                </CardFooter>
            </Card>
        </div>
    );
};

export default ProfileSettings;
