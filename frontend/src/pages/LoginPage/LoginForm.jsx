import * as React from "react";
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
    return (
        <Box
            sx={(theme) => ({
                width: { xs: "100%" },
                transition: "width var(--Transition-duration)",
                transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
                position: "relative",
                zIndex: 1,
                display: "flex",
                justifyContent: "flex-end",
                backdropFilter: "blur(12px)",
                [theme.getColorSchemeSelector("dark")]: {
                    backgroundColor: "#0F1214",
                },
            })}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    px: 2,
                }}
            >
                <Box
                    component="main"
                    sx={{
                        my: "auto",
                        py: 2,
                        pb: 5,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: 400,
                        maxWidth: "100%",
                        mx: "auto",
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
                    <Stack sx={{ gap: 4, mb: 2 }}>
                        <Stack sx={{ gap: 1 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: "2",
                                    alignItems: "center",
                                }}
                            >
                                <Link component={RouterLink} to="/">
                                    <ArrowBackIos fontSize="xl" />
                                </Link>
                                <Typography component="h1" level="h3">
                                    Войти
                                </Typography>
                            </Box>
                            <Typography level="body-sm">
                                Еще нет аккаунта?{" "}
                                <Link
                                    component={RouterLink}
                                    to="/register"
                                    level="title-sm"
                                >
                                    Зарегистирируйтесь!
                                </Link>
                            </Typography>
                        </Stack>
                    </Stack>

                    <Stack sx={{ gap: 4, mt: 2 }}>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                const formElements =
                                    event.currentTarget.elements;
                                const data = {
                                    email: formElements.email.value,
                                    password: formElements.password.value,
                                    persistent: formElements.persistent.checked,
                                };
                                alert(JSON.stringify(data, null, 2));
                            }}
                        >
                            <FormControl required>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" name="email" />
                            </FormControl>
                            <FormControl required>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" name="password" />
                            </FormControl>
                            <Stack sx={{ gap: 4, mt: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Checkbox
                                        size="sm"
                                        label="Сохранить вход"
                                        name="persistent"
                                    />
                                    <Link
                                        level="title-sm"
                                        href="#replace-with-a-link"
                                    >
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
                <Box component="footer" sx={{ py: 3 }}>
                    <Typography level="body-xs" sx={{ textAlign: "center" }}>
                        © IDENTICS {new Date().getFullYear()}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}