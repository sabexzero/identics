import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/forms/auth/login";
import { RegisterForm } from "@/components/forms/auth/register";
import { Logo } from "@/components/ui/logo";

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState("login");

    return (
        <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center space-y-4 mb-8">
                    <Logo className="h-12 w-12" />
                    <h1 className="text-2xl font-bold text-center">
                        ПлагиатСкан
                    </h1>
                    <p className="text-muted-foreground text-center">
                        Надежный инструмент для проверки уникальности текста
                    </p>
                </div>

                <div className="bg-card rounded-lg border shadow-sm p-6">
                    <Tabs
                        defaultValue="login"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid grid-cols-2 mb-6 w-full">
                            <TabsTrigger value="login">Вход</TabsTrigger>
                            <TabsTrigger value="register">
                                Регистрация
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <LoginForm />
                        </TabsContent>
                        <TabsContent value="register">
                            <RegisterForm />
                        </TabsContent>
                    </Tabs>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Используя наш сервис, вы соглашаетесь с{" "}
                    <a
                        href="#"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Условиями использования
                    </a>{" "}
                    и{" "}
                    <a
                        href="#"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Политикой конфиденциальности
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
