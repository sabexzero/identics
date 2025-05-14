import { useEffect, useState, useRef, useCallback } from "react";
import {
    useGetNotificationsQuery,
    useReadAllNotificationsMutation,
    useReadNotificationsMutation,
} from "@/api/notificationApi";
import { RootState } from "@/api/store.ts";
import { useSelector } from "react-redux";

export interface NotificationPayload {
    id: number;
    title: string;
    message: string;
    type: string;
    documentId: number;
    createdAt: string;
    read: boolean;
}

interface useNotificationsOptions {
    url: string;
    onMessage?: (data: NotificationPayload) => void;
}

export function useNotifications({ url, onMessage }: useNotificationsOptions) {
    const userId = useSelector((state: RootState) => state.user.userId);

    const { data } = useGetNotificationsQuery();
    const [readNotification] = useReadNotificationsMutation();
    const [readAllNotifications] = useReadAllNotificationsMutation();

    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (data?.items) {
            setNotifications(data.items);
        }
    }, [data?.items]);

    useEffect(() => {
        if (userId) {
            const connect = () => {
                const ws = new WebSocket(`${url}/${userId}`);

                ws.onopen = () => {
                    console.log("WebSocket connected");
                    setIsConnected(true);
                };

                ws.onclose = () => {
                    console.log("WebSocket disconnected");
                    setIsConnected(false);
                    setTimeout(() => {
                        if (wsRef.current?.readyState !== WebSocket.OPEN) {
                            connect();
                        }
                    }, 3000);
                };

                ws.onerror = (error) => {
                    console.error("WebSocket error:", error);
                };

                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data) as NotificationPayload;

                        setNotifications((prev) => [data, ...prev]);

                        if (onMessage) {
                            onMessage(data);
                        }
                    } catch (error) {
                        console.error("Error parsing WebSocket message:", error);
                    }
                };

                wsRef.current = ws;

                return ws;
            };

            const ws = connect();

            return () => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.close();
                }
            };
        }
    }, [userId]);

    const markAllAsRead = useCallback((userId: number | null) => {
        if (userId) {
            readAllNotifications();
            setNotifications([]);
        }
    }, []);

    const markAsRead = useCallback((userId: number | null, id: number) => {
        if (userId) {
            readNotification({
                id: id,
            });
            setNotifications((prev) => [...prev.filter((item) => item.id !== id)]);
        }
    }, []);

    return {
        isConnected,
        notifications,
        markAllAsRead,
        markAsRead,
    };
}
