import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/api/authApi";
import { IGetNotificationResponse, IReadNotification } from "@/api/notificationApi/types.ts";

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getNotifications: build.query<IGetNotificationResponse, void>({
            query: () => {
                return `/api/v1/notifications`;
            },
        }),
        readAllNotifications: build.mutation<IGetNotificationResponse, void>({
            query: () => {
                return {
                    url: `/api/v1/notifications/read`,
                    method: "PUT",
                };
            },
        }),
        readNotifications: build.mutation<IGetNotificationResponse, IReadNotification>({
            query: ({ id }) => {
                return {
                    url: `/api/v1/notifications/${id}/read`,
                    method: "PUT",
                };
            },
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useReadNotificationsMutation,
    useReadAllNotificationsMutation,
} = notificationApi;
