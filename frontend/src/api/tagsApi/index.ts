import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    ICreateTagResponse,
    IDeleteTag,
    IEditTag,
    IGetTags,
    IGetTagsResponse,
    ITagsResponse,
} from "@/api/tagsApi/types.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const tagsApi = createApi({
    reducerPath: "tagsApi",
    baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
    endpoints: (build) => ({
        getTags: build.query<IGetTagsResponse, IGetTags>({
            query: ({ userId }) => {
                return `/api/v1/${userId}/tags`;
            },
        }),
        createTag: build.mutation<ITagsResponse, ICreateTagResponse>({
            query: ({ userId, name, hexString }) => ({
                url: `/api/v1/${userId}/tags`,
                method: "POST",
                body: {
                    name: name,
                    hexString: hexString,
                },
            }),
        }),
        deleteTag: build.mutation<void, IDeleteTag>({
            query: ({ userId, id }) => ({
                url: `/api/v1/${userId}/tags/${id}`,
                method: "DELETE",
            }),
        }),
        editTag: build.mutation<ITagsResponse, IEditTag>({
            query: ({ userId, id, name, hexString }) => ({
                url: `/api/v1/${userId}/tags/${id}`,
                method: "PUT",
                body: {
                    name: name,
                    hexString: hexString,
                },
            }),
        }),
    }),
});

export const { useGetTagsQuery, useCreateTagMutation, useDeleteTagMutation, useEditTagMutation } =
    tagsApi;
