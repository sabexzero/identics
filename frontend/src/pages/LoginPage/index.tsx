import React from "react";
import { Container } from "@mui/material";
import LoginForm from "../../components/AuthForms/LoginForm";
import AuthForms from "../../components/AuthForms";

const LoginPage: React.FC = () => {
    return (
        <Container>
            <AuthForms
                title="Войти"
                promptText="Ещё нет аккаунта?"
                linkText="Зарегистрироваться"
                linkTo="/auth/reg"
                reversed
            >
                <LoginForm />
            </AuthForms>
        </Container>
    );
};

export default LoginPage;
