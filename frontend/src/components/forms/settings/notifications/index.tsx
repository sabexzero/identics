import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/components/forms/settings/notifications/schema";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Bell, Mail, Globe, FileCheck, Check, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const NotificationSettings: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            emailNotifications: true,
            browserNotifications: true,
            reportReadyNotifications: true,
        },
    });

    const onSubmit = (data: z.infer<typeof schema>) => {
        setIsSubmitting(true);
        console.log(data);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <Card className="border border-primary/10 shadow-lg shadow-primary/5 overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Bell className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Уведомления
                            </CardTitle>
                            <CardDescription className="text-base">
                                Настройте способы и частоту получения
                                уведомлений
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pb-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                        <Globe className="h-5 w-5 text-primary" />
                                        Каналы уведомлений
                                    </h3>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="emailNotifications"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-primary/10 p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                                                    <div className="space-y-1">
                                                        <FormLabel className="text-base font-medium flex items-center gap-2">
                                                            <Mail className="h-5 w-5 text-primary" />
                                                            Email уведомления
                                                        </FormLabel>
                                                        <FormDescription className="text-sm">
                                                            Получать уведомления
                                                            на email
                                                        </FormDescription>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="browserNotifications"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-primary/10 p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                                                    <div className="space-y-1">
                                                        <FormLabel className="text-base font-medium flex items-center gap-2">
                                                            <Bell className="h-5 w-5 text-primary" />
                                                            Уведомления в
                                                            браузере
                                                        </FormLabel>
                                                        <FormDescription className="text-sm">
                                                            Получать
                                                            push-уведомления в
                                                            браузере
                                                        </FormDescription>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                        <Bell className="h-5 w-5 text-primary" />
                                        Типы уведомлений
                                    </h3>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="reportReadyNotifications"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-primary/10 p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                                                    <div className="space-y-1">
                                                        <FormLabel className="text-base font-medium flex items-center gap-2">
                                                            <FileCheck className="h-5 w-5 text-green-500" />
                                                            Готовность отчетов
                                                        </FormLabel>
                                                        <FormDescription className="text-sm">
                                                            Уведомления о
                                                            готовности отчетов
                                                        </FormDescription>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="h-11 px-6 w-full md:w-auto relative overflow-hidden group"
                                    disabled={isSubmitting || isSuccess}
                                >
                                    <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-primary/90 transition-transform duration-300 ease-out"></span>
                                    <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Сохранение...
                                            </>
                                        ) : isSuccess ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Сохранено!
                                            </>
                                        ) : (
                                            "Сохранить настройки"
                                        )}
                                    </span>
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="py-3 text-xs text-muted-foreground">
                    Последнее обновление: 31 марта 2025, 15:46
                </CardFooter>
            </Card>
        </div>
    );
};

export default NotificationSettings;
