import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    IGetPaginationContent,
    IGetPaginationContentResponse,
} from "./types.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const contentApi = createApi({
    reducerPath: "contentApi",
    baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
    endpoints: (build) => ({
        getPaginationContent: build.query<
            IGetPaginationContentResponse,
            IGetPaginationContent
        >({
            query: ({ userId, folderId, page, perPage }) => {
                return `content/${userId}?page=${page}&perPage=${perPage}&folderId=${folderId}`;
            },
        }),
    }),
});

export const { useGetPaginationContentQuery } = contentApi;
