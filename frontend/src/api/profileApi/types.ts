export interface IGetProfile {
    userId: number;
}

export interface IEditProfile extends IGetProfile {
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
