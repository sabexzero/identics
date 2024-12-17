import * as React from 'react';
import { useState, useEffect } from 'react';
import { CssVarsProvider } from "@mui/joy/styles";
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Directory from './components/Directory';
import OrderTable from './components/OrderTable';
import CssBaseline from "@mui/joy/CssBaseline";
import framesxTheme from "../../components/theme/theme";

export default function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState(null);

    // Получаем профиль пользователя, используя JWT токен
    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem("jwt"); // Получаем токен из localStorage

            if (!token) {
                setError("Токен не найден. Пожалуйста, войдите в систему.");
                return;
            }

            try {
                const response = await fetch("https://your-api-url.com/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`, // Отправляем токен в заголовке
                    },
                });

                if (!response.ok) {
                    throw new Error("Ошибка при загрузке данных профиля");
                }

                const data = await response.json();
                setProfileData(data); // Сохраняем данные профиля
            } catch (error) {
                setError(error.message);
            }
        };

        fetchProfileData(); // Загружаем данные профиля
    }, []);

    return (
        <CssVarsProvider disableTransitionOnChange theme={framesxTheme}>
            <CssBaseline />
            <Box
                sx={(theme) => ({
                    paddingX: "3%",
                    display: "flex",
                    minHeight: "100dvh",
                    width: "100%",
                    mx: "auto",
                    overflow: "hidden",
                    scrollSnapType: "y mandatory",
                    "& > div": {
                        scrollSnapAlign: "start",
                    },
                    backgroundColor: theme.vars.palette.background.default,
                    [theme.getColorSchemeSelector("dark")]: {
                        backgroundColor: "#0F1214",
                    },
                })}
            >
                <Box
                    component="main"
                    className="MainContent"
                    sx={{
                        px: { xs: 2, md: 6 },
                        pt: { xs: 'calc(12px + var(--Header-height))', sm: 'calc(12px + var(--Header-height))', md: 3 },
                        pb: { xs: 2, sm: 2, md: 3 },
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 0,
                        height: '100dvh',
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            mb: 1,
                            gap: 1,
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'start', sm: 'center' },
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography color="primary" level="h1" component="h1"
                                    sx={{
                                        flexGrow: 1,
                                        fontWeight: 'xs',
                                        fontSize: 'clamp(1rem, 1rem + 2.1818vw, 2rem)',
                                        fontFamily: 'Questrial, sans-serif',
                                        letterSpacing: '20px',
                                        mb: { xs: 2, sm: 0 },
                                        pt: { xs: 2, sm: 0 },
                                    }}>
                            IDENTICS
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'flex-end',
                            flexDirection: { xs: 'row', sm: 'row' },
                            alignItems: { xs: 'center', sm: 'center' },
                            flexWrap: 'wrap',
                        }}>
                            <Button
                                color="none"
                                size="sm"
                            >
                                История
                                <AccessTimeIcon sx={{
                                    marginLeft: '0.5rem',
                                }} />
                            </Button>

                            <Typography sx={{
                                py: '4px',
                                px: '4px',
                                mb: { xs: 1, sm: 0 },
                            }}>
                                &nbsp;Баланс: 3209₽ &nbsp;
                                <Button
                                    color="primary"
                                    size="sm"
                                >
                                    Пополнить
                                </Button>
                            </Typography>

                            <Button
                                color="primary"
                                size="sm"
                                onClick={() => {
                                    localStorage.removeItem("jwt"); // Удалить токен при выходе
                                    window.location.reload(); // Перезагрузить страницу после выхода
                                }}
                            >
                                Выйти
                            </Button>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flex: 1,
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 0.3,
                                    minWidth: 0,
                                    mt: { xs: 2, sm: 14 },
                                }}
                            >
                                <Directory />
                            </Box>

                            <Box
                                sx={{
                                    flex: 2,
                                    minWidth: 0,
                                }}
                            >
                                {profileData ? (
                                    <Box>
                                        <Typography level="h2">Привет, {profileData.firstName}!</Typography>
                                        <Typography level="body1">Город: {profileData.city}</Typography>
                                        <Typography level="body1">Учебное заведение: {profileData.institution}</Typography>
                                    </Box>
                                ) : (
                                    <Typography level="body1">Загрузка данных профиля...</Typography>
                                )}
                                <OrderTable />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
