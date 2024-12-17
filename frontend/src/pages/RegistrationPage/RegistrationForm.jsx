import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

export default function RegistrationForm() {
    const [step, setStep] = React.useState(1); // Step state to manage forms
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
        repeatPassword: "",
        persistent: false,
        firstName: "",
        lastName: "",
        middleName: "",
        city: "",
        institution: "",
    });

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleNext = (event) => {
        event.preventDefault();
        setStep(2);
    };

    const handleBack = () => setStep(1);

    const handleRegister = async (event) => {
        event.preventDefault();

        // Проверяем, что пароли совпадают
        if (formData.password !== formData.repeatPassword) {
            alert("Пароли не совпадают!");
            return;
        }

        // Отправляем данные на сервер
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_REGISTER_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    middleName: formData.middleName,
                    city: formData.city,
                    institution: formData.institution,
                }),
            });

            if (!response.ok) {
                throw new Error("Ошибка регистрации");
            }

            // Получаем ответ от сервера (например, токен)
            const result = await response.json();
            const token = result.token; // Предполагаем, что сервер возвращает token

            // Сохраняем токен в localStorage
            localStorage.setItem("jwt", token);

            // После регистрации можно перенаправить пользователя на другую страницу
            alert("Регистрация успешна!");

            // Можно перенаправить на страницу входа или домой
            // navigate("/home"); // если используете React Router
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            alert("Ошибка при регистрации");
        }
    };

    return (
        <Box
            sx={(theme) => ({
                width: "100%",
                transition: "width var(--Transition-duration)",
                position: "relative",
                zIndex: 1,
                display: "flex",
                justifyContent: "center",
                backdropFilter: "blur(12px)",
                [theme.getColorSchemeSelector("dark")]: {
                    backgroundColor: "#0F1214",
                },
                padding: { xs: "16px", sm: "24px" },
                minHeight: "100vh",
                overflow: "auto",
                [theme.breakpoints.down("sm")]: {
                    overflow: "hidden",
                },
            })}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    maxWidth: 480,
                    px: { xs: 2, sm: 4 },
                    my: "auto",
                }}
            >
                <Typography level="body-sm" sx={{ mb: 2 }}>
                    <span style={{ color: "red" }}>*</span> Обязательные поля
                </Typography>
                <Box
                    component="main"
                    sx={{
                        py: { xs: 2, sm: 3 },
                        pb: { xs: 4, sm: 5 },
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                        borderRadius: "sm",
                        "& form": {
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        },
                    }}
                >
                    {step === 1 && (
                        <form onSubmit={handleNext}>
                            <FormControl required sx={{ width: "100%" }}>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                            <FormControl required sx={{ width: "100%" }}>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                            <FormControl required sx={{ width: "100%" }}>
                                <FormLabel>Repeat password</FormLabel>
                                <Input
                                    type="password"
                                    name="repeatPassword"
                                    value={formData.repeatPassword}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                            <Checkbox
                                size="sm"
                                label="Сохранить вход"
                                name="persistent"
                                checked={formData.persistent}
                                onChange={handleChange}
                            />
                            <Button type="submit" fullWidth>
                                Далее
                            </Button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleRegister}>
                            <FormControl required sx={{ width: "100%" }}>
                                <FormLabel>Имя</FormLabel>
                                <Input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                            <FormControl required sx={{ width: "100%" }}>
                                <FormLabel>Фамилия</FormLabel>
                                <Input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                            <FormControl sx={{ width: "100%" }}>
                                <FormLabel>Отчество (опционально)</FormLabel>
                                <Input
                                    type="text"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                            <FormControl required sx={{ width: "100%" }}>
                                <FormLabel>Город</FormLabel>
                                <Input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                            <FormControl required sx={{ width: "100%" }}>
                                <FormLabel>Образовательное учреждение</FormLabel>
                                <Input
                                    type="text"
                                    name="institution"
                                    value={formData.institution}
                                    onChange={handleChange}
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                                <Button onClick={handleBack}>Назад</Button>
                                <Button type="submit">Зарегистрироваться</Button>
                            </Stack>
                        </form>
                    )}
                </Box>
                <Box component="footer" sx={{ py: 2 }}>
                    <Typography level="body-xs" sx={{ textAlign: "center" }}>
                        © IDENTICS {new Date().getFullYear()}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
