import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IGetReport, IGetReportResponse } from "@/api/reportApi/types.ts";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const reportApi = createApi({
    reducerPath: "reportApi",
    baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
    endpoints: (build) => ({
        getReport: build.query<IGetReportResponse, IGetReport>({
            query: ({ userId, id, format }) => {
                const searchParams = new URLSearchParams();
                searchParams.set("format", format);

                return `/api/v1/${userId}/documents/${id}/report?${searchParams}`;
            },
        }),
    }),
});

export const { useGetReportQuery } = reportApi;
