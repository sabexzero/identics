export interface INotification {
    userId: number;
}

export interface IGetNotificationResponse {
    items: {
        id: number;
        title: string;
        message: string;
        type: string;
        documentId: number;
        createdAt: string;
        read: true;
    }[];
}

export interface IReadNotification extends INotification {
    id: number;
}
