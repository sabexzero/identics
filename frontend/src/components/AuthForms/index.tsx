import React from "react";
import TwoSidedLayout from "../TwoSidedLayout";
import { AuthContainer, ContentContainer, FormRow } from "./styled";
import { Box, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router";
import { ArrowBackIos } from "@mui/icons-material";

interface AuthFormProps {
    children: React.ReactNode;
    linkTo: string;
    reversed?: boolean;
    title?: string;
    linkText?: string;
    promptText?: string;
}

const AuthForms: React.FC<AuthFormProps> = ({
    children,
    title,
    linkText,
    linkTo,
    promptText,
    reversed = false,
}) => {
    return (
        <TwoSidedLayout reversed={reversed}>
            <AuthContainer>
                <ContentContainer>
                    <Box>
                        <FormRow>
                            <Link
                                sx={{
                                    height: "20px",
                                }}
                                component={RouterLink}
                                to="/"
                            >
                                <ArrowBackIos fontSize="small" />
                            </Link>
                            <Typography
                                sx={{
                                    ml: 1,
                                    fontSize: "28px",
                                    fontWeight: 500,
                                }}
                            >
                                {title}
                            </Typography>
                        </FormRow>
                    </Box>
                    {children}
                    <FormRow sx={{ gap: 1 }}>
                        <Typography
                            sx={{
                                alignItems: "center",
                                textAlign: "left",
                            }}
                        >
                            {promptText}
                        </Typography>
                        <Link
                            sx={{ textDecoration: "none" }}
                            component={RouterLink}
                            to={linkTo}
                        >
                            {linkText}
                        </Link>
                    </FormRow>
                </ContentContainer>
            </AuthContainer>
        </TwoSidedLayout>
    );
};

export default AuthForms;
