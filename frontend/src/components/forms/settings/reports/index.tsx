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
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "@/components/forms/settings/reports/schema";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
    FileText,
    FileType,
    Underline,
    FileOutput,
    Percent,
    Link,
    BarChart,
    Stamp,
    Palette,
    FileCheck,
    Clock,
    Check,
    Loader2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ReportSettings: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            reportFormat: "pdf",
            highlightStyle: "underline",
            includeOriginalText: true,
            includeSimilarityScore: true,
            includeSourceLinks: true,
            includeStatistics: true,
            watermarkText: "Конфиденциально",
            reportColorScheme: "standard",
            autoGenerateReports: true,
            reportRetentionDays: 90,
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
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Настройки отчетов
                            </CardTitle>
                            <CardDescription className="text-base">
                                Настройте формат и содержание отчетов о проверке
                                на плагиат
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
                                        <FileType className="h-5 w-5 text-primary" />
                                        Формат отчета
                                    </h3>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="highlightStyle"
                                            render={({ field }) => (
                                                <FormItem className="space-y-4 p-4 rounded-xl border border-primary/10 shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 rounded-full bg-primary/10">
                                                            <Underline className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <FormLabel className="text-base font-medium">
                                                            Стиль выделения
                                                            совпадений
                                                        </FormLabel>
                                                    </div>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11 w-full transition-all border-muted-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary">
                                                                <SelectValue placeholder="Выберите стиль выделения" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem
                                                                value="highlight"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-4 w-4 bg-yellow-200 rounded"></div>
                                                                    Выделение
                                                                    цветом
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem
                                                                value="underline"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-4 w-4 border-b-2 border-red-500"></div>
                                                                    Подчеркивание
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem
                                                                value="bold"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-4 w-4 font-bold text-xs">
                                                                        A
                                                                    </div>
                                                                    Жирный шрифт
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription className="text-xs">
                                                        Как будут выделены
                                                        совпадения в тексте
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="reportColorScheme"
                                            render={({ field }) => (
                                                <FormItem className="space-y-4 p-4 rounded-xl border border-primary/10 shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 rounded-full bg-primary/10">
                                                            <Palette className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <FormLabel className="text-base font-medium">
                                                            Цветовая схема
                                                            отчета
                                                        </FormLabel>
                                                    </div>
                                                    <Select
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11 w-full transition-all border-muted-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary">
                                                                <SelectValue placeholder="Выберите цветовую схему" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem
                                                                value="standard"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <div className="flex items-center gap-1">
                                                                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                                                                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                                                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                                                                    Стандартная
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem
                                                                value="highContrast"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <div className="flex items-center gap-1">
                                                                    <div className="h-3 w-3 rounded-full bg-black"></div>
                                                                    <div className="h-3 w-3 rounded-full bg-white border"></div>
                                                                    <div className="h-3 w-3 rounded-full bg-red-600"></div>
                                                                    Высокий
                                                                    контраст
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem
                                                                value="monochrome"
                                                                className="flex items-center gap-2"
                                                            >
                                                                <div className="flex items-center gap-1">
                                                                    <div className="h-3 w-3 rounded-full bg-black"></div>
                                                                    <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                                                                    <div className="h-3 w-3 rounded-full bg-gray-300"></div>
                                                                    Монохромная
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormDescription className="text-xs">
                                                        Цветовая схема для
                                                        отчетов
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="reportFormat"
                                            render={({ field }) => (
                                                <FormItem className="space-y-4 p-4 rounded-xl border border-primary/10 shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 rounded-full bg-primary/10">
                                                            <FileType className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <FormLabel className="text-base font-medium">
                                                            Формат отчета
                                                        </FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                            className="flex flex-col space-y-0"
                                                        >
                                                            <FormItem className="flex items-center space-x-0 space-y-0 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                                                                <FormControl>
                                                                    <RadioGroupItem
                                                                        value="pdf"
                                                                        className="data-[state=checked]:border-primary data-[state=checked]:text-primary"
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-medium flex items-center gap-2">
                                                                    <FileText className="h-4 w-4 text-red-500" />
                                                                    PDF
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-0 space-y-0 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                                                                <FormControl>
                                                                    <RadioGroupItem
                                                                        value="docx"
                                                                        className="data-[state=checked]:border-primary data-[state=checked]:text-primary"
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-medium flex items-center gap-2">
                                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                                    DOCX
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-0 space-y-0 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                                                                <FormControl>
                                                                    <RadioGroupItem
                                                                        value="html"
                                                                        className="data-[state=checked]:border-primary data-[state=checked]:text-primary"
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-medium flex items-center gap-2">
                                                                    <FileText className="h-4 w-4 text-green-500" />
                                                                    HTML
                                                                </FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormDescription className="text-xs">
                                                        Выберите формат для
                                                        скачивания отчетов
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
                                        <FileOutput className="h-5 w-5 text-primary" />
                                        Содержание отчета
                                    </h3>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="includeOriginalText"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-primary/10 p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                                                    <div className="space-y-1">
                                                        <FormLabel className="text-base font-medium flex items-center gap-2">
                                                            <FileText className="h-5 w-5 text-primary" />
                                                            Включать
                                                            оригинальный текст
                                                        </FormLabel>
                                                        <FormDescription className="text-sm">
                                                            Добавлять полный
                                                            текст документа в
                                                            отчет
                                                        </FormDescription>
                                                    </div>
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
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="includeSimilarityScore"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-primary/10 p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                                                    <div className="space-y-1">
                                                        <FormLabel className="text-base font-medium flex items-center gap-2">
                                                            <Percent className="h-5 w-5 text-primary" />
                                                            Включать процент
                                                            совпадений
                                                        </FormLabel>
                                                        <FormDescription className="text-sm">
                                                            Показывать общий
                                                            процент совпадений в
                                                            отчете
                                                        </FormDescription>
                                                    </div>
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
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="includeSourceLinks"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-primary/10 p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                                                    <div className="space-y-1">
                                                        <FormLabel className="text-base font-medium flex items-center gap-2">
                                                            <Link className="h-5 w-5 text-primary" />
                                                            Включать ссылки на
                                                            источники
                                                        </FormLabel>
                                                        <FormDescription className="text-sm">
                                                            Добавлять ссылки на
                                                            оригинальные
                                                            источники
                                                        </FormDescription>
                                                    </div>
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
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="includeStatistics"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-primary/10 p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                                                    <div className="space-y-1">
                                                        <FormLabel className="text-base font-medium flex items-center gap-2">
                                                            <BarChart className="h-5 w-5 text-primary" />
                                                            Включать статистику
                                                        </FormLabel>
                                                        <FormDescription className="text-sm">
                                                            Добавлять подробную
                                                            статистику по
                                                            совпадениям
                                                        </FormDescription>
                                                    </div>
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
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="watermarkText"
                                            render={({ field }) => (
                                                <FormItem className="space-y-4 p-4 rounded-xl border border-primary/10 shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 rounded-full bg-primary/10">
                                                            <Stamp className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <FormLabel className="text-base font-medium">
                                                            Текст водяного знака
                                                        </FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            className="h-11 px-4 transition-all border-muted-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary"
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-xs">
                                                        Текст, который будет
                                                        отображаться как водяной
                                                        знак на страницах отчета
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
                                        <FileCheck className="h-5 w-5 text-primary" />
                                        Дополнительные настройки
                                    </h3>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="autoGenerateReports"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-xl border border-primary/10 p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                                                    <div className="space-y-1">
                                                        <FormLabel className="text-base font-medium flex items-center gap-2">
                                                            <FileCheck className="h-5 w-5 text-primary" />
                                                            Автоматическая
                                                            генерация отчетов
                                                        </FormLabel>
                                                        <FormDescription className="text-sm">
                                                            Автоматически
                                                            создавать отчет
                                                            после завершения
                                                            проверки
                                                        </FormDescription>
                                                    </div>
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
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="reportRetentionDays"
                                            render={({ field }) => (
                                                <FormItem className="space-y-4 p-4 rounded-xl border border-primary/10 shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-2 rounded-full bg-primary/10">
                                                            <Clock className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <FormLabel className="text-base font-medium">
                                                            Срок хранения
                                                            отчетов (дней)
                                                        </FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    Number.parseInt(
                                                                        e.target
                                                                            .value,
                                                                        10
                                                                    )
                                                                )
                                                            }
                                                            className="h-11 px-4 transition-all border-muted-foreground/20 focus:border-primary focus:ring-1 focus:ring-primary"
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-xs">
                                                        Количество дней, в
                                                        течение которых отчеты
                                                        будут храниться в
                                                        системе
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

export default ReportSettings;
