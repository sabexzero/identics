import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import framesxTheme from "../../components/theme/theme";
import Layout from "./Layout";

export default function LoginPage() {
    return (
        <CssVarsProvider disableTransitionOnChange theme={framesxTheme}>
            <CssBaseline />
            <Box
                sx={(theme) => ({
                    minHeight: "100vh",
                    overflow: "hidden",
                    scrollSnapType: "y mandatory",
                    "& > div": {
                        scrollSnapAlign: "start",
                    },
                    [theme.getColorSchemeSelector("dark")]: {
                        backgroundColor: "#0F1214",
                    },
                })}
            >
                <Layout />
            </Box>
        </CssVarsProvider>
    );
}
