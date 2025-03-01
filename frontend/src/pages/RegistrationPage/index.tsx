import React from "react";
import { Container } from "@mui/material";
import RegistrationForm from "../../components/AuthForms/RegistrationForm";
import AuthForms from "../../components/AuthForms";

const RegistrationPage: React.FC = () => {
    return (
        <Container>
            <AuthForms
                title="Зарегистрироваться"
                promptText="Уже есть аккаунт?"
                linkText="Войти"
                linkTo="/auth/login"
            >
                <RegistrationForm />
            </AuthForms>
        </Container>
    );
};

export default RegistrationPage;
