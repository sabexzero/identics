import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/api/authApi";
import {
    IGetNotificationResponse,
    INotification,
    IReadNotification,
} from "@/api/notificationApi/types.ts";

export const notificationApi = createApi({
    reducerPath: "notificationApi",
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getNotifications: build.query<IGetNotificationResponse, INotification>({
            query: ({ userId }) => {
                return `/api/v1/${userId}/notifications`;
            },
        }),
        readAllNotifications: build.mutation<IGetNotificationResponse, INotification>({
            query: ({ userId }) => {
                return {
                    url: `/api/v1/${userId}/notifications/read`,
                    method: "PUT",
                };
            },
        }),
        readNotifications: build.mutation<IGetNotificationResponse, IReadNotification>({
            query: ({ userId, id }) => {
                return {
                    url: `/api/v1/${userId}/notifications/${id}/read`,
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
