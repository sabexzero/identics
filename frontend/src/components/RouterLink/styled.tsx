import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

export const RegisterButton = styled(Button)(({ theme }) => ({
    backgroundColor: "white",
    border: "1px solid black",
    color: "black",
    padding: "0.5rem 2rem",
    borderRadius: "4px",
    fontWeight: 600,
    fontSize: "1rem",
    textTransform: "none",
    transition: "all 0.3s ease",
    "&:hover": {
        color: "white",
        backgroundColor: theme.palette.primary.dark,
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        transform: "translateY(-2px)",
    },
}));
