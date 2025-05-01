import { useRefreshMutation } from "@/api/authApi";
import { useEffect, useState } from "react";

export default function useAuth() {
    const [refresh] = useRefreshMutation();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    console.log("test");

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                await refresh().unwrap();
                setIsAuthenticated(true);
            } catch (error) {
                console.error(error);
                localStorage.removeItem("accessToken");
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    return { isAuthenticated };
}
