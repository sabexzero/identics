import { createApi } from "@reduxjs/toolkit/query/react";
import {
    IDeleteTag,
    IGetDocumentsTag,
    IGetTagsResponse,
    ITagsResponse,
} from "@/api/tagsApi/types.ts";
import { baseQueryWithReauth } from "@/api/authApi";

export const tagsApi = createApi({
    reducerPath: "tagsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["UpdateTags", "UpdateExactTags"],
    endpoints: (build) => ({
        getTags: build.query<IGetTagsResponse, void>({
            providesTags: ["UpdateTags"],
            query: () => {
                return `/api/v1/tags`;
            },
        }),
        getDocumentTags: build.query<IGetTagsResponse, IGetDocumentsTag>({
            providesTags: ["UpdateTags", "UpdateExactTags"],
            query: ({ id }) => {
                return `/api/v1/documents/${id}/tags`;
            },
        }),
        createTag: build.mutation<ITagsResponse, Omit<ITagsResponse, "id">>({
            invalidatesTags: ["UpdateTags"],
            query: ({ name, hexString }) => ({
                url: `/api/v1/tags`,
                method: "POST",
                body: {
                    name: name,
                    hexString: hexString,
                },
            }),
        }),
        deleteTag: build.mutation<void, IDeleteTag>({
            invalidatesTags: ["UpdateTags"],
            query: ({ id }) => ({
                url: `/api/v1/tags/${id}`,
                method: "DELETE",
            }),
        }),
        editTag: build.mutation<ITagsResponse, ITagsResponse>({
            invalidatesTags: ["UpdateTags"],
            query: ({ id, name, hexString }) => ({
                url: `/api/v1/tags/${id}`,
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
