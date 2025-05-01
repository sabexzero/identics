import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPostLogin, IPostLoginResponse, IPostRegister } from "@/api/authApi/types";
import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const baseUrl = import.meta.env.VITE_BASE_URL;

const getTokenFromLocalStorage = () => {
    return localStorage.getItem("accessToken");
};

const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = getTokenFromLocalStorage();

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshResult = await baseQuery(
            { url: "/api/v1/auth/refresh-token", method: "POST" },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const newAccessToken = (refreshResult.data as { token: string }).token;
            localStorage.setItem("accessToken", newAccessToken);
            result = await baseQuery(args, api, extraOptions);
        } else {
            console.log("LOGOUT");
            await baseQuery({ url: "/auth/signout", method: "POST" }, api, extraOptions);
        }
    }

    return result;
};

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            const token = getTokenFromLocalStorage();
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (build) => ({
        login: build.mutation<IPostLoginResponse, IPostLogin>({
            query: (credentials) => ({
                url: "/api/v1/auth/login",
                method: "POST",
                body: credentials,
                credentials: "include",
            }),
        }),
        logout: build.mutation<void, void>({
            query: () => ({
                url: `/api/v1/auth/signout`,
                method: "POST",
                credentials: "include",
            }),
        }),
        refresh: build.mutation<void, void>({
            query: () => ({
                url: "/api/v1/auth/refresh-token",
                method: "POST",
                credentials: "include",
            }),
        }),
        register: build.mutation<IPostLoginResponse, IPostRegister>({
            query: ({ email, password, name }) => ({
                url: `/api/v1/auth/register`,
                method: "POST",
                body: {
                    email,
                    password,
                    name,
                },
            }),
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useRefreshMutation } =
    authApi;
