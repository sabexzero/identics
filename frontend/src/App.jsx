import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState, useMemo } from "react";

import LoginPage from "./pages/LoginPage/LoginPage";
import MainPage from "./pages/MainPage/MainPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import PersonalAccount from "./pages/PersonalAccount/PersonalAccount";
import ColorSchemeToggle from "./components/ColorSchemeToggle/ColorSchemeToggle";
import { CssVarsProvider } from "@mui/joy/styles";

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
                </CssVarsProvider>

                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/profile" element={<ProfilePage    />} />
                    <Route path="/profileold" element={<PersonalAccount />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
