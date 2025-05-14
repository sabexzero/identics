import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/api/authApi";
import { IEditSettings, ISettingsResponse } from "@/api/settingsApi/types.ts";

export const settingsApi = createApi({
    reducerPath: "settingsApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getSettings: build.query<ISettingsResponse, void>({
            query: () => {
                return `/api/v1/settings`;
            },
        }),
        editSettings: build.mutation<ISettingsResponse, IEditSettings>({
            query: ({ ...rest }) => ({
                url: `/api/v1/settings`,
                method: "PUT",
                body: {
                    ...rest,
                },
            }),
        }),
    }),
});

export const { useEditSettingsMutation, useGetSettingsQuery } = settingsApi;
