import { useEffect, useState, useRef, useCallback } from "react";

export type NotificationType = "CHECK_COMPLETED" | "SYSTEM";

export interface NotificationPayload {
    documentId: number;
    title: string;
    message: string;
    type: NotificationType;
    timestamp: string;
}

interface UseWebSocketOptions {
    url: string;
    onMessage?: (data: NotificationPayload) => void;
}

export function useWebSocket({ url, onMessage }: UseWebSocketOptions) {
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<NotificationPayload[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connect = () => {
            const ws = new WebSocket(url);

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
                    setUnreadCount((prev) => prev + 1);

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
    }, []);

    const markAllAsRead = useCallback(() => {
        setUnreadCount(0);
        setNotifications([]);
    }, []);

    const markAsRead = useCallback((id: number) => {
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) => [...prev.filter((item) => item.documentId !== id)]);
    }, []);

    return {
        isConnected,
        notifications,
        unreadCount,
        markAllAsRead,
        markAsRead,
    };
}
