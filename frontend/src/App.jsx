import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import MainPage from "./pages/MainPage/MainPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import ColorSchemeToggle from "./components/ColorSchemeToggle/ColorSchemeToggle";
import { CssVarsProvider } from "@mui/joy/styles";

// Компонент с анимированными роутами
const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    const [mode, setMode] = useState("light");

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: mode,
                },
            }),
        [mode]
    );

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <CssVarsProvider>
                    <ColorSchemeToggle
                        toggleColorMode={toggleColorMode}
                        mode={mode}
                    />
                    <AnimatedRoutes />
                </CssVarsProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
