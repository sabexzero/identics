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

export default function RegistrationForm() {
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
                                    Зарегистрироваться
                                </Typography>
                            </Box>
                            <Typography level="body-sm">
                                У вас уже есть аккаунт?{" "}
                                <Link
                                    component={RouterLink}
                                    to="/login"
                                    level="title-sm"
                                >
                                    Войти
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
                            <FormControl required>
                                <FormLabel>Repeat password</FormLabel>
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
                                </Box>
                                <Button type="submit" fullWidth>
                                    Зарегистрироваться
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
