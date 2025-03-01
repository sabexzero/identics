import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AnimatePresence } from "framer-motion";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import { store } from "./api/store.ts";
import Header from "./components/Header";

const AnimatedRoutes = () => {
    const location = useLocation(); // useLocation теперь внутри <Router>

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<MainPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/reg" element={<RegistrationPage />} />
                <Route path="/home" element={<Header />}>
                    <Route index element={<Home />} />
                </Route>
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    const theme = createTheme({
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1440,
            },
        },
        components: {
            MuiContainer: {
                styleOverrides: {
                    root: {
                        padding: "0 40px!important",
                    },
                },
                defaultProps: {
                    maxWidth: "xl",
                },
            },
            MuiTypography: {
                styleOverrides: {
                    root: {
                        fontFamily: "'Inter', serif",
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <CssBaseline />
                <Router>
                    <AnimatePresence mode="wait">
                        <AnimatedRoutes />
                    </AnimatePresence>
                </Router>
            </Provider>
        </ThemeProvider>
    );
}

export default App;
