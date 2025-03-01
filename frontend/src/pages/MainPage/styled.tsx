import { styled } from "@mui/material/styles";
import { Typography, Link, Container, Box } from "@mui/material";
import { LinkProps as MuiLinkProps } from "@mui/material";
import { LinkProps as RouterLinkProps } from "react-router-dom";

type LoginLinkProps = MuiLinkProps & RouterLinkProps;

export const FlexContainer = styled(Container)({
    height: "100vh",
    display: "flex",
    justifyContent: "center",
});

export const ContentBox = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
});

export const Logo = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: "bold",
    fontSize: "clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)",
    fontFamily: "Questrial, sans-serif",
    letterSpacing: "20px",
    marginTop: "0",
    textTransform: "uppercase",
    [theme.breakpoints.down("md")]: {
        marginTop: "2rem",
    },
}));

export const Heading = styled(Typography)(({ theme }) => ({
    fontSize: "clamp(1.5rem, 1.1rem + 1.7vw, 2.5rem)",
    fontWeight: 600,
    marginTop: theme.spacing(3),
    lineHeight: 1.3,
    textAlign: "center",
    maxWidth: "800px",
}));

export const Description = styled(Typography)(({ theme }) => ({
    fontSize: "1.125rem",
    color: theme.palette.text.secondary,
    maxWidth: "500px",
    textAlign: "center",
}));

export const LoginText = styled(Typography)({
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
});

export const LoginLink = styled(Link)<LoginLinkProps>(({ theme }) => ({
    color: theme.palette.primary.dark,
    textDecoration: "none",
    fontWeight: 600,
    transition: "all 0.2s ease",
    "&:hover": {
        color: theme.palette.primary.main,
        textDecoration: "underline",
    },
}));
