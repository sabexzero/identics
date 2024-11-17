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
                                <Link component={RouterLink} to="/">
                                    <ArrowBackIos fontSize="large" />
                                </Link>
                                <Typography component="h1" level="h3" sx={{ width: "100%" }}>
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

                    <Stack sx={{ gap: 3, mt: 2 }}>
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
                            <FormControl required sx={{ width: "100%" }}>
                                <FormLabel>Email</FormLabel>
                                <Input type="email" name="email" sx={{ width: "100%" }} />
                            </FormControl>
                            <FormControl required sx={{ width: "100%" }}>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" name="password" sx={{ width: "100%" }} />
                            </FormControl>
                            <FormControl required sx={{ width: "100%" }}>
                                <FormLabel>Repeat password</FormLabel>
                                <Input type="password" name="password" sx={{ width: "100%" }} />
                            </FormControl>
                            <Stack sx={{ gap: 3, mt: 2 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexDirection: { xs: "column", sm: "row" },
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
