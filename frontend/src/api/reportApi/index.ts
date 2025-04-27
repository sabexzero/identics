import { createApi } from "@reduxjs/toolkit/query/react";
import { IGetReport, IGetReportResponse } from "@/api/reportApi/types.ts";
import { baseQueryWithReauth } from "@/api/authApi";

export const reportApi = createApi({
    reducerPath: "reportApi",
    baseQuery: baseQueryWithReauth,
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
