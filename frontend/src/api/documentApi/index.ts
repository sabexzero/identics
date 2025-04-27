import { BaseQueryFn, createApi, FetchArgs } from "@reduxjs/toolkit/query/react";
import {
    IAdditionalDocumentCheck,
    IEditDocument,
    IEditDocumentTags,
    IGetDocumentById,
    IGetDocumentByIdResponse,
    IGetDocuments,
    IGetDocumentsResponse,
    IUploadDocumentResponse,
    IUploadFileDocument,
    IUploadTextDocument,
} from "./types.ts";
import { ErrorHandler } from "@/api/store.ts";
import { baseQueryWithReauth } from "@/api/authApi";

export const documentApi = createApi({
    reducerPath: "documentApi",
    baseQuery: baseQueryWithReauth as BaseQueryFn<string | FetchArgs, unknown, ErrorHandler>,
    tagTypes: ["UpdateTable"],
    endpoints: (build) => ({
        getDocuments: build.query<IGetDocumentsResponse, IGetDocuments>({
            providesTags: ["UpdateTable"],
            query: ({ userId, tagIds, page, size, search, sortDirection, sortBy }) => {
                const searchParams = new URLSearchParams();
                if (tagIds) {
                    for (const tagId of tagIds) {
                        searchParams.set("tagIds", tagId.toString());
                    }
                }

                searchParams.set("page", page.toString());
                searchParams.set("size", size.toString());

                if (search) {
                    searchParams.set("search", search);
                }

                if (sortDirection) {
                    searchParams.set("sortDirection", sortDirection);
                }

                if (sortBy) {
                    searchParams.set("sortBy", sortBy);
                }

                return `/api/v1/${userId}/documents?${searchParams.toString()}`;
            },
        }),
        getDocumentById: build.query<IGetDocumentByIdResponse, IGetDocumentById>({
            query: ({ userId, id }) => {
                return `/api/v1/${userId}/documents/${id}`;
            },
        }),
        deleteDocumentById: build.mutation<IGetDocumentByIdResponse, IGetDocumentById>({
            invalidatesTags: ["UpdateTable"],
            query: ({ userId, id }) => ({
                url: `/api/v1/${userId}/documents/${id}`,
                method: "DELETE",
            }),
        }),
        uploadTextDocument: build.mutation<IUploadDocumentResponse, IUploadTextDocument>({
            invalidatesTags: ["UpdateTable"],
            query: ({ userId, title, userIds, content }) => {
                return {
                    url: `/api/v1/${userId}/documents/text`,
                    method: "POST",
                    body: {
                        title: title,
                        content: content,
                        contentType: "RAW_TEXT",
                        userIds: userIds,
                    },
                };
            },
        }),
        uploadFileDocument: build.mutation<IUploadDocumentResponse, IUploadFileDocument>({
            query: ({ userId, title, file }) => {
                const searchParams = new URLSearchParams();
                const formData = new FormData();
                formData.append("file", file);
                searchParams.set("title", title);

                return {
                    url: `/api/v1/${userId}/documents/file?${searchParams}`,
                    method: "POST",
                    body: formData,
                };
            },
        }),
        additionalDocumentCheck: build.mutation<void, IAdditionalDocumentCheck>({
            query: ({ userId, id, ai, plagiarism }) => {
                const searchParams = new URLSearchParams();

                if (plagiarism) {
                    searchParams.set("plagiarismCheck", `${plagiarism}`);
                }

                if (ai) {
                    searchParams.set("aiDetection", `${ai}`);
                }

                return {
                    url: `/api/v1/${userId}/documents/${id}/check?${searchParams}`,
                    method: "POST",
                };
            },
        }),
        editDocumentTags: build.mutation<IUploadDocumentResponse, IEditDocumentTags>({
            invalidatesTags: ["UpdateTable"],
            query: ({ userId, id, tagsIds }) => ({
                url: `/api/v1/${userId}/documents/${id}`,
                method: "PATCH",
                body: {
                    tagIds: tagsIds,
                },
            }),
        }),
        editDocument: build.mutation<IUploadDocumentResponse, IEditDocument>({
            invalidatesTags: ["UpdateTable"],
            query: ({ userId, id, tagsIds, title }) => ({
                url: `/api/v1/${userId}/documents/${id}`,
                method: "PUT",
                body: {
                    tagIds: tagsIds,
                    title: title,
                },
            }),
        }),
    }),
});

export const {
    useGetDocumentsQuery,
    useGetDocumentByIdQuery,
    useDeleteDocumentByIdMutation,
    useUploadTextDocumentMutation,
    useUploadFileDocumentMutation,
    useAdditionalDocumentCheckMutation,
    useEditDocumentTagsMutation,
    useEditDocumentMutation,
} = documentApi;
