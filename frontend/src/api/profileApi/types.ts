export interface IEditProfile {
    name: string;
    email: string;
    city?: string;
    institution?: string;
}

export interface IProfileResponse {
    id: number;
    name: string;
    city?: string;
    institution?: string;
    checksAvailable: number;
    email: string;
    checksUsed: number;
}

export interface ICreateApiKeyResponse {
    id: number;
    userId: number;
    keyValue: string;
    name: string;
    createdAt: string;
    lastUsedAt: string;
    expiresAt: string;
    enabled: boolean;
}
