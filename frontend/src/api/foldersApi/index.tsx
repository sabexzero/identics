import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    IGetFolders,
    IGetFoldersItemResponse,
} from "@/api/foldersApi/types.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const foldersApi = createApi({
    reducerPath: "foldersApi",
    baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
    endpoints: (build) => ({
        getAllFolders: build.query<IGetFoldersItemResponse[], IGetFolders>({
            query: ({ userId }) => {
                /*const searchParams = new URLSearchParams();
                searchParams.set("userId", userId.toString());

                if (parentId) {
                    searchParams.set("parentId", parentId.toString());
                }*/

                return `folders/${userId}/full`;
            },
        }),
    }),
});

export const { useGetAllFoldersQuery } = foldersApi;
