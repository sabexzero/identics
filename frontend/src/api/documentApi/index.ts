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
    IUploadInfoForReport,
    IUploadInfoForReportResponse,
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
            query: ({ tagIds, page, size, searchTerm, sortDirection, sortBy }) => {
                const searchParams = new URLSearchParams();
                if (tagIds) {
                    searchParams.set("tagIds", tagIds.toString());
                }

                searchParams.set("page", page.toString());
                searchParams.set("size", size.toString());

                if (searchTerm) {
                    searchParams.set("searchTerm", searchTerm);
                }

                if (sortDirection) {
                    searchParams.set("sortDirection", sortDirection);
                }

                if (sortBy) {
                    searchParams.set("sortBy", sortBy);
                }

                return `/api/v1/documents?${searchParams.toString()}`;
            },
        }),
        getDocumentById: build.query<IGetDocumentByIdResponse, IGetDocumentById>({
            query: ({ id }) => {
                return `/api/v1/documents/${id}`;
            },
        }),
        deleteDocumentById: build.mutation<IGetDocumentByIdResponse, IGetDocumentById>({
            invalidatesTags: ["UpdateTable"],
            query: ({ id }) => ({
                url: `/api/v1/documents/${id}`,
                method: "DELETE",
            }),
        }),
        uploadTextDocument: build.mutation<IUploadDocumentResponse, IUploadTextDocument>({
            invalidatesTags: ["UpdateTable"],
            query: ({ title, content }) => {
                return {
                    url: `/api/v1/documents/text`,
                    method: "POST",
                    body: {
                        title: title,
                        content: content,
                        contentType: "RAW_TEXT",
                    },
                };
            },
        }),
        uploadFileDocument: build.mutation<IUploadDocumentResponse, IUploadFileDocument>({
            invalidatesTags: ["UpdateTable"],
            query: ({ title, file }) => {
                const searchParams = new URLSearchParams();
                const formData = new FormData();
                formData.append("file", file);
                searchParams.set("title", title);

                return {
                    url: `/api/v1/documents/file?${searchParams}`,
                    method: "POST",
                    body: formData,
                };
            },
        }),
        additionalDocumentCheck: build.mutation<void, IAdditionalDocumentCheck>({
            query: ({ id, ai, plagiarism }) => {
                const searchParams = new URLSearchParams();

                if (plagiarism) {
                    searchParams.set("plagiarismCheck", `${plagiarism}`);
                }

                if (ai) {
                    searchParams.set("aiDetection", `${ai}`);
                }

                return {
                    url: `/api/v1/documents/${id}/check?${searchParams}`,
                    method: "POST",
                };
            },
        }),
        editDocumentTags: build.mutation<IUploadDocumentResponse, IEditDocumentTags>({
            invalidatesTags: ["UpdateTable"],
            query: ({ id, tagsIds }) => ({
                url: `/api/v1/documents/${id}`,
                method: "PATCH",
                body: {
                    tagIds: tagsIds,
                },
            }),
        }),
        editDocument: build.mutation<IUploadDocumentResponse, IEditDocument>({
            invalidatesTags: ["UpdateTable"],
            query: ({ id, tagsIds, title }) => ({
                url: `/api/v1/documents/${id}`,
                method: "PUT",
                body: {
                    tagIds: tagsIds,
                    title: title,
                },
            }),
        }),
        uploadInfoForReport: build.mutation<IUploadInfoForReportResponse, IUploadInfoForReport>({
            query: ({ id, ...rest }) => ({
                url: `/api/v1/documents/report/${id}`,
                method: "POST",
                body: {
                    ...rest,
                },
            }),
        }),
    }),
});

export const {
    useGetDocumentsQuery,
    useGetDocumentByIdQuery,
    useUploadInfoForReportMutation,
    useDeleteDocumentByIdMutation,
    useUploadTextDocumentMutation,
    useUploadFileDocumentMutation,
    useAdditionalDocumentCheckMutation,
    useEditDocumentTagsMutation,
    useEditDocumentMutation,
} = documentApi;
