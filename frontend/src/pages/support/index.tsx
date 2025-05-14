import { Mail, Phone, MessageSquare, FileQuestion, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip.tsx";

export default function HelpAndSupportPage() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <h1 className="text-3xl font-bold mb-6">Помощь и поддержка</h1>
            <p className="text-muted-foreground mb-8">
                Здесь вы найдете ответы на часто задаваемые вопросы и способы связаться с нашей
                командой поддержки.
            </p>

            <div className="grid gap-6 md:grid-cols-2 mb-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Электронная почта
                        </CardTitle>
                        <CardDescription>
                            Напишите нам, и мы ответим в течение 24 часов
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium mb-4">support@textsource.ru</p>
                        <Button variant="outline" asChild>
                            Написать письмо
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            Телефон поддержки
                        </CardTitle>
                        <CardDescription>
                            Доступен в рабочие дни с 9:00 до 18:00 (МСК)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="font-medium mb-4">+7 (960) 868-41-44</p>
                        <Button variant="outline" asChild>
                            Позвонить
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Онлайн-чат
                        </CardTitle>
                        <CardDescription>Мгновенная помощь от наших специалистов</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-4">
                            Воспользуйтесь онлайн-чатом в правом нижнем углу экрана для быстрого
                            получения помощи.
                        </p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="inline-block">
                                        <Button disabled className="pointer-events-none">
                                            Начать чат
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Данная функция находится в разработке</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileQuestion className="h-5 w-5" />
                            База знаний
                        </CardTitle>
                        <CardDescription>Подробные руководства и инструкции</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-4">
                            Изучите нашу базу знаний с подробными инструкциями по использованию
                            сервиса.
                        </p>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="inline-block">
                                        <Button disabled className="pointer-events-none">
                                            Открыть базу знаний
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Данная функция находится в разработке</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardContent>
                </Card>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Часто задаваемые вопросы</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Как работает проверка на плагиат?</AccordionTrigger>
                        <AccordionContent>
                            Наш сервис сравнивает ваш текст с множеством документов из интернета,
                            научных журналов и баз данных. Система анализирует текст и выявляет
                            совпадения, предоставляя подробный отчет о найденных источниках и
                            процентном соотношении оригинального и заимствованного контента.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Какие форматы файлов поддерживаются?</AccordionTrigger>
                        <AccordionContent>
                            Наш сервис поддерживает следующие форматы файлов: .doc, .docx, .pdf,
                            .txt. Максимальный размер загружаемого файла составляет 10 МБ.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>
                            Как интерпретировать результаты проверки?
                        </AccordionTrigger>
                        <AccordionContent>
                            После проверки вы получите отчет с процентом оригинальности текста. Чем
                            выше процент, тем более уникален ваш текст. В отчете также будут указаны
                            источники заимствований с возможностью просмотра совпадающих фрагментов.
                            Это поможет вам определить, какие части текста требуют переработки.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Как оплатить услуги сервиса?</AccordionTrigger>
                        <AccordionContent>
                            Вы можете оплатить услуги сервиса с помощью СБП. Для юридических лиц
                            доступна оплата по безналичному расчету с предоставлением всех
                            необходимых документов. После оплаты доступ к сервису открывается
                            автоматически.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>Безопасны ли мои данные?</AccordionTrigger>
                        <AccordionContent>
                            Мы гарантируем полную конфиденциальность ваших данных. Все загруженные
                            документы хранятся на защищенных серверах и не передаются третьим лицам.
                            Мы используем шифрование для защиты передаваемой информации. После
                            проверки вы можете удалить свои документы из системы.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Обучающие материалы</CardTitle>
                    <CardDescription>
                        Полезные ресурсы для эффективного использования сервиса
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <p className="text-primary hover:underline">Руководство пользователя</p>
                        </li>
                        <li className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <p className="text-primary hover:underline">
                                Видеоинструкции по работе с сервисом
                            </p>
                        </li>
                        <li className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <p className="text-primary hover:underline">
                                Как повысить уникальность текста
                            </p>
                        </li>
                        <li className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            <p className="text-primary hover:underline">
                                Требования к уникальности в различных учебных заведениях
                            </p>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
