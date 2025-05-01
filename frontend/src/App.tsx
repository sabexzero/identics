import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    Outlet,
    Navigate,
} from "react-router-dom";
import AuthPage from "@/pages/auth/page.tsx";
import DashboardPage from "@/pages/dashboard/page.tsx";
import HistoryPage from "@/pages/history/page.tsx";
import Layout from "@/components/layout";
import { AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import { store } from "./api/store.ts";
import "./index.css";
import ReviewPage from "@/pages/review/page.tsx";
import Settings from "@/pages/settings/page.tsx";
import useAuth from "./hooks/use-auth.ts";

function ProtectedRoute() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated || isAuthenticated === null) {
        return <Outlet />;
    }

    return <Navigate to="/auth" replace />;
}

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/auth" element={<AuthPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Layout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="/dashboard/history" element={<HistoryPage />} />
                        <Route path="/dashboard/review/:id" element={<ReviewPage />} />
                        <Route path="/dashboard/settings" element={<Settings />} />
                    </Route>
                </Route>
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <Provider store={store}>
            <Router>
                <AnimatePresence mode="wait">
                    <AnimatedRoutes />
                </AnimatePresence>
            </Router>
        </Provider>
    );
}

export default App;
