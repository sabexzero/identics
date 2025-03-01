import { configureStore } from "@reduxjs/toolkit";
import { contentApi } from "./contentApi";

export const store = configureStore({
    reducer: {
        [contentApi.reducerPath]: contentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(contentApi.middleware),
});
