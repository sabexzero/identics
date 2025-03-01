import React from "react";
import { Checkbox, FormControl, FormLabel, Input, Link } from "@mui/material";
import RouterLink from "../../RouterLink";
import { HelpersContainer, InputContainer } from "../styled";

const LoginForm: React.FC = () => {
    return (
        <form>
            <InputContainer>
                <FormControl required sx={{ width: "100%" }}>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" name="email" sx={{ width: "100%" }} />
                </FormControl>
                <FormControl required sx={{ width: "100%" }}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        name="password"
                        sx={{ width: "100%" }}
                    />
                </FormControl>
            </InputContainer>
            <HelpersContainer>
                <Checkbox name="persistent" />
                <Link
                    sx={{ textDecoration: "none" }}
                    href="#replace-with-a-link"
                >
                    Забыли пароль?
                </Link>
            </HelpersContainer>
            <RouterLink
                to="/auth/login"
                fullWidth
                sx={{
                    marginTop: "1rem",
                    backgroundColor: "transparent",
                    border: "1px solid black",
                    color: "black",
                }}
            >
                Войти
            </RouterLink>
        </form>
    );
};

export default LoginForm;
