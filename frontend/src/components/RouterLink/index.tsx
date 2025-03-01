import React from "react";
import { Link } from "react-router-dom";
import { RegisterButton } from "./styled.tsx";
import { ButtonOwnProps } from "@mui/material";

interface RouterLinkProps extends ButtonOwnProps {
    to: string;
    children: React.ReactNode | string;
}

const RouterLink: React.FC<RouterLinkProps> = ({ to, children, ...rest }) => {
    return (
        <Link to={to} style={{ textDecoration: "none" }}>
            <RegisterButton {...rest}>{children}</RegisterButton>
        </Link>
    );
};

export default RouterLink;
