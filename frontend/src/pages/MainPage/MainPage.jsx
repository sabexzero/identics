import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import framesxTheme from "../../components/theme/theme";
import MotionDiv from "../../components/motion/MotionDiv.jsx";
import Layout from "./Layout.jsx";

export default function MainPage() {
    return (
        <CssVarsProvider disableTransitionOnChange theme={framesxTheme}>
            <CssBaseline />
            <Box
                sx={(theme) => ({
                    height: "100vh",
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
