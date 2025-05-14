import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/components/forms/settings/api/schema";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    AlertCircle,
    Copy,
    RefreshCw,
    Code,
    Webhook,
    Bell,
    FileText,
    Check,
    Loader2,
    KeyRound,
    Eye,
    EyeOff,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useEditSettingsMutation, useGetSettingsQuery } from "@/api/settingsApi";
import { toast } from "sonner";
import { ErrorHandler } from "@/api/store.ts";
import { useCreateApiKeyMutation } from "@/api/profileApi";

const ApiSettings: React.FC = () => {
    const [isCopied, setIsCopied] = useState(false);
    const [showKey, setShowKey] = useState(false);

    const { data: settings, isLoading: settingsLoading } = useGetSettingsQuery();
    const [createApiKey, { isLoading: isRegenerating }] = useCreateApiKeyMutation();

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            apiKey: settings?.apiKey || "",
            isWebHookNotificationsEnabled: settings?.isWebHookNotificationsEnabled,
            isApiCallsLoggingEnabled: settings?.isApiCallsLoggingEnabled,
            apiWebhookUrl: settings?.apiWebhookUrl || "",
        },
    });

    const [editSettings, { isLoading, isSuccess }] = useEditSettingsMutation();

    const onRegenerating = async () => {
        try {
            const result = await createApiKey().unwrap();
            form.setValue("apiKey", result.keyValue);
        } catch (error) {
            toast.error("Ошибка!", {
                description: `Возникла ошибка при генерации API ключа: ${(error as ErrorHandler).data.error}`,
            });
        }
    };

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            await editSettings({
                ...settings!,
                apiWebhookUrl: data.apiWebhookUrl || "",
                isApiCallsLoggingEnabled: data.isApiCallsLoggingEnabled,
                isWebHookNotificationsEnabled: data.isWebHookNotificationsEnabled,
            }).unwrap();
        } catch (error) {
            toast.error("Ошибка!", {
                description: `Возникла ошибка при сохранении настроек: ${(error as ErrorHandler).data.error}`,
            });
        }
    };

    const copyApiKey = () => {
        navigator.clipboard.writeText(form.getValues("apiKey"));
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    useEffect(() => {
        form.reset({
            apiKey: settings?.apiKey,
            isWebHookNotificationsEnabled: settings?.isWebHookNotificationsEnabled,
            isApiCallsLoggingEnabled: settings?.isApiCallsLoggingEnabled,
            apiWebhookUrl: settings?.apiWebhookUrl || "",
        });
    }, [form, settingsLoading, settings]);

    return (
        <div className="space-y-6">
            <Card className="border border-primary/10 shadow-lg shadow-primary/5 overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-primary/10">
                            <Code className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">API Настройки</CardTitle>
                            <CardDescription className="text-base">
                                Настройте доступ к API для интеграции с другими сервисами
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pb-6">
                    <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle className="font-semibold">Важно</AlertTitle>
                        <AlertDescription className="text-sm">
                            Ваш API ключ дает полный доступ к вашему аккаунту. Никогда не делитесь
                            им и не публикуйте в открытом коде.
                        </AlertDescription>
                    </Alert>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                        <KeyRound className="h-5 w-5 text-primary" />
                                        API Ключ
                                    </h3>

                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="apiKey"
                                            render={({ field }) => (
                                                <FormItem className="space-y-4 p-4 rounded-xl border border-primary/10 shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 rounded-full bg-primary/10">
                                                            <KeyRound className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <FormLabel className="text-base font-medium">
                                                            API Ключ
                                                        </FormLabel>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <FormControl>
                                                            <div className="relative w-full">
                                                                <Input
                                                                    {...field}
                                                                    type={
                                                                        showKey
                                                                            ? "text"
                                                                            : "password"
                                                                    }
                                                                    readOnly
                                                                    className="h-10 pr-24 font-mono text-sm transition-all border-muted-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary"
                                                                />
                                                                {showKey ? (
                                                                    <EyeOff
                                                                        className="absolute cursor-pointer right-2.5 top-3 h-4 w-4 text-muted-foreground"
                                                                        onClick={() =>
                                                                            setShowKey(false)
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <Eye
                                                                        className="absolute cursor-pointer right-2.5 top-3 h-4 w-4 text-muted-foreground"
                                                                        onClick={() =>
                                                                            setShowKey(true)
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </FormControl>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        type="button"
                                                                        size="icon"
                                                                        variant="outline"
                                                                        onClick={copyApiKey}
                                                                        className="h-10 w-10 transition-all border-muted-foreground/20 hover:border-primary hover:bg-primary/5"
                                                                    >
                                                                        {isCopied ? (
                                                                            <Check className="h-4 w-4 text-green-500" />
                                                                        ) : (
                                                                            <Copy className="h-4 w-4" />
                                                                        )}
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>
                                                                        {isCopied
                                                                            ? "Скопировано!"
                                                                            : "Копировать ключ"}
                                                                    </p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        type="button"
                                                                        size="icon"
                                                                        variant="outline"
                                                                        onClick={onRegenerating}
                                                                        className="h-10 w-10 transition-all border-muted-foreground/20 hover:border-primary hover:bg-primary/5"
                                                                        disabled={isRegenerating}
                                                                    >
                                                                        {isRegenerating ? (
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                        ) : (
                                                                            <RefreshCw className="h-4 w-4" />
                                                                        )}
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Сгенерировать новый ключ</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                    <FormDescription className="text-xs">
                                                        Используйте этот ключ для аутентификации API
                                                        запросов
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                        <Webhook className="h-5 w-5 text-primary" />
                                        Webhook и уведомления
                                    </h3>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="isWebHookNotificationsEnabled"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-primary/10 p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                                                    <div className="space-y-1">
                                                        <FormLabel className="text-base font-medium flex items-center gap-2">
                                                            <Bell className="h-5 w-5 text-primary" />
                                                            Уведомлять о завершении проверки
                                                        </FormLabel>
                                                        <FormDescription className="text-sm">
                                                            Отправлять webhook при завершении
                                                            проверки на плагиат
                                                        </FormDescription>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="isApiCallsLoggingEnabled"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-primary/10 p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                                                    <div className="space-y-1">
                                                        <FormLabel className="text-base font-medium flex items-center gap-2">
                                                            <FileText className="h-5 w-5 text-primary" />
                                                            Логировать API вызовы
                                                        </FormLabel>
                                                        <FormDescription className="text-sm">
                                                            Сохранять историю всех API запросов
                                                        </FormDescription>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="apiWebhookUrl"
                                            render={({ field }) => (
                                                <FormItem className="space-y-4 p-4 rounded-xl border border-primary/10 shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 rounded-full bg-primary/10">
                                                            <Webhook className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <FormLabel className="text-base font-medium">
                                                            URL для webhook
                                                        </FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="https://example.com/webhook"
                                                            className="h-11 px-4 transition-all border-muted-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary"
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-xs">
                                                        URL, на который будут отправляться
                                                        уведомления о событиях
                                                    </FormDescription>
                                                    <FormMessage />
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
                                    disabled={isLoading}
                                >
                                    <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-primary/90 transition-transform duration-300 ease-out"></span>
                                    <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                                        {isLoading ? (
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

export default ApiSettings;
