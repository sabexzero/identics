import { configureStore } from "@reduxjs/toolkit";
import { contentApi } from "./contentApi";
import { foldersApi } from "@/api/foldersApi";

export const store = configureStore({
    reducer: {
        [contentApi.reducerPath]: contentApi.reducer,
        [foldersApi.reducerPath]: foldersApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            contentApi.middleware,
            foldersApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
