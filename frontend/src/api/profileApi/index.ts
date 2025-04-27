import { createApi } from "@reduxjs/toolkit/query/react";
import { IEditProfile, IGetProfile, IProfileResponse } from "@/api/profileApi/types.ts";
import { baseQueryWithReauth } from "@/api/authApi";

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getProfile: build.query<IProfileResponse, IGetProfile>({
            query: ({ userId }) => {
                return `/api/v1/${userId}/profile`;
            },
        }),
        editProfile: build.mutation<IProfileResponse, IEditProfile>({
            query: ({ userId, ...rest }) => ({
                url: `/api/v1/${userId}/profile`,
                method: "PUT",
                body: {
                    ...rest,
                },
            }),
        }),
    }),
});

export const { useGetProfileQuery } = profileApi;
