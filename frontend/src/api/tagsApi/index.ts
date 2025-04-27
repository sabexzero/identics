import { createApi } from "@reduxjs/toolkit/query/react";
import {
    ICreateTagResponse,
    IDeleteTag,
    IEditTag,
    IGetDocumentsTag,
    IGetTags,
    IGetTagsResponse,
    ITagsResponse,
} from "@/api/tagsApi/types.ts";
import { baseQueryWithReauth } from "@/api/authApi";

export const tagsApi = createApi({
    reducerPath: "tagsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["UpdateTags", "UpdateExactTags"],
    endpoints: (build) => ({
        getTags: build.query<IGetTagsResponse, IGetTags>({
            providesTags: ["UpdateTags"],
            query: ({ userId }) => {
                return `/api/v1/${userId}/tags`;
            },
        }),
        getDocumentTags: build.query<IGetTagsResponse, IGetDocumentsTag>({
            providesTags: ["UpdateTags", "UpdateExactTags"],
            query: ({ userId, id }) => {
                return `/api/v1/${userId}/documents/${id}/tags`;
            },
        }),
        createTag: build.mutation<ITagsResponse, ICreateTagResponse>({
            invalidatesTags: ["UpdateTags"],
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
            invalidatesTags: ["UpdateTags"],
            query: ({ userId, id }) => ({
                url: `/api/v1/${userId}/tags/${id}`,
                method: "DELETE",
            }),
        }),
        editTag: build.mutation<ITagsResponse, IEditTag>({
            invalidatesTags: ["UpdateTags"],
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

export const {
    useGetTagsQuery,
    useGetDocumentTagsQuery,
    useCreateTagMutation,
    useDeleteTagMutation,
    useEditTagMutation,
} = tagsApi;
