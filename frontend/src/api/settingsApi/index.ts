import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/api/authApi";
import { IEditSettings, IGetSettings, ISettingsResponse } from "@/api/settingsApi/types.ts";

export const settingsApi = createApi({
    reducerPath: "settingsApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getSettings: build.query<ISettingsResponse, IGetSettings>({
            query: ({ userId }) => {
                return `/api/v1/${userId}/settings`;
            },
        }),
        editSettings: build.mutation<ISettingsResponse, IEditSettings>({
            query: ({ userId, ...rest }) => ({
                url: `/api/v1/${userId}/settings`,
                method: "PUT",
                body: {
                    ...rest,
                },
            }),
        }),
    }),
});

export const { useEditSettingsMutation, useGetSettingsQuery } = settingsApi;
