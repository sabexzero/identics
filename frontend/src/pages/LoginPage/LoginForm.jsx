import * as React from "react";
import { useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import { Link as RouterLink } from "react-router-dom";
import { ArrowBackIos } from "@mui/icons-material";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [persistent, setPersistent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const loginData = {
            email,
            password,
            persistent,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_LOGIN_ENDPOINT}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });


            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token); // Сохраняем токен
                alert("Login successful");
                // Перенаправление или другая логика после успешного входа
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            setError("Error connecting to the server");
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
                minHeight: "100vh", // Ensure the container takes full height
                overflow: "auto", // Allow scrolling if content overflows
                [theme.breakpoints.down("sm")]: {
                    overflow: "hidden", // Disable scrolling on small screens
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
                    my: "auto", // Center the content vertically
                }}
            >
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
                        [`& .MuiFormLabel-asterisk`]: {
                            visibility: "hidden",
                        },
                    }}
                >
                    <Stack sx={{ gap: 3, mb: 2 }}>
                        <Stack sx={{ gap: 1 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0,
                                }}
                            >
                                <Link component={RouterLink} to="/" sx={{ display: "flex", alignItems: "center" }}>
                                    <ArrowBackIos fontSize="large" />
                                </Link>
                                <Typography component="h1" level="h3" sx={{ ml: 1 }}>
                                    Войти
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "start", flexDirection: "column" }}>
                                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: { xs: 0, sm: 1 } }}>
                                    <Typography level="body-sm" sx={{ alignItems: "center", textAlign: "left" }}>
                                        Еще нет аккаунта?{" "}
                                    </Typography>
                                    <Link component={RouterLink} to="/register" level="title-sm">
                                        Зарегистрироваться
                                    </Link>
                                </Box>
                            </Box>
                        </Stack>
                    </Stack>

                    <Stack sx={{ gap: 3, mt: 2 }}>
                        <form onSubmit={handleSubmit}>
                            <FormControl required sx={{ width: "100%" }}>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                            <FormControl required sx={{ width: "100%" }}>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    sx={{ width: "100%" }}
                                />
                            </FormControl>
                            {error && (
                                <Typography level="body2" color="danger" sx={{ mb: 2 }}>
                                    {error}
                                </Typography>
                            )}
                            <Stack sx={{ gap: 3, mt: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexDirection: { xs: "row", sm: "row" },
                                    }}
                                >
                                    <Checkbox
                                        size="sm"
                                        label="Сохранить вход"
                                        name="persistent"
                                        checked={persistent}
                                        onChange={(e) => setPersistent(e.target.checked)}
                                    />
                                    <Link level="title-sm" href="#replace-with-a-link">
                                        Забыли пароль?
                                    </Link>
                                </Box>
                                <Button type="submit" fullWidth>
                                    Войти
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
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
