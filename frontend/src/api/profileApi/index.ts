import { createApi } from "@reduxjs/toolkit/query/react";
import { ICreateApiKeyResponse, IEditProfile, IProfileResponse } from "@/api/profileApi/types.ts";
import { baseQueryWithReauth } from "@/api/authApi";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["UpdateProfile"],
    endpoints: (build) => ({
        getProfile: build.query<IProfileResponse, void>({
            providesTags: ["UpdateProfile"],
            query: () => {
                return `/api/v1/profile`;
            },
        }),
        editProfile: build.mutation<IProfileResponse, IEditProfile>({
            invalidatesTags: ["UpdateProfile"],
            query: ({ ...rest }) => ({
                url: `/api/v1/profile`,
                method: "PUT",
                body: {
                    ...rest,
                },
            }),
        }),
        createApiKey: build.mutation<ICreateApiKeyResponse, void>({
            invalidatesTags: ["UpdateProfile"],
            query: () => ({
                url: `/api/v1/api-keys`,
                method: "POST",
            }),
        }),
        deleteProfile: build.mutation<void, void>({
            invalidatesTags: ["UpdateProfile"],
            query: () => ({
                url: `/api/v1/profile`,
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetProfileQuery,
    useEditProfileMutation,
    useDeleteProfileMutation,
    useCreateApiKeyMutation,
} = profileApi;
