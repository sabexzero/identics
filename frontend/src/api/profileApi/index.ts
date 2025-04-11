import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IEditProfile, IGetProfile, IProfileResponse } from "@/api/profileApi/types.ts";

const baseUrl = import.meta.env.BASE_URL;

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
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
