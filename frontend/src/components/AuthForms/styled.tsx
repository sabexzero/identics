import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const AuthContainer = styled(Box)(({ theme }) => ({
    width: "100%",
    transition: "width var(--Transition-duration)",
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    backdropFilter: "blur(12px)",
    padding: "24px",
    minHeight: "100vh",
    overflow: "auto",
    [theme.breakpoints.down("sm")]: {
        padding: "16px",
        overflow: "hidden",
    },
}));

export const ContentContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 480,
    flex: 1,
    px: "2rem",
    margin: "4rem 0",
    gap: "1rem",
    [theme.breakpoints.down("sm")]: {
        px: "1rem",
    },
}));

export const FormRow = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: 0,
});

export const InputContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
});

export const HelpersContainer = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1rem",
});
