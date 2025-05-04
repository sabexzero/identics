import { useRefreshMutation } from "@/api/authApi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/api/store.ts";
import { setUserId } from "@/api/userSlice";

export default function useAuth() {
    const [refresh] = useRefreshMutation();
    const dispatch = useDispatch();
    const userId = useSelector((state: RootState) => state.user.userId);
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
                if (!userId) {
                    const result = await refresh().unwrap();
                    dispatch(setUserId(result.userId));
                }
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
