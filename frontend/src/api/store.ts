import { configureStore } from "@reduxjs/toolkit";
import { documentApi } from "./documentApi";
import { reportApi } from "@/api/reportApi";
import { profileApi } from "@/api/profileApi";
import { tagsApi } from "@/api/tagsApi";
import { authApi } from "@/api/authApi";
import { notificationApi } from "@/api/notificationApi";
import { settingsApi } from "@/api/settingsApi";
import userReducer from "@/api/userSlice";

export const store = configureStore({
    reducer: {
        [documentApi.reducerPath]: documentApi.reducer,
        [reportApi.reducerPath]: reportApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [tagsApi.reducerPath]: tagsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
        [settingsApi.reducerPath]: settingsApi.reducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            documentApi.middleware,
            reportApi.middleware,
            profileApi.middleware,
            tagsApi.middleware,
            authApi.middleware,
            notificationApi.middleware,
            settingsApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface ErrorHandler {
    data: {
        error: string;
        status: number;
    };
}
