export interface IGetProfile {
    userId: number;
}

export interface IEditProfile extends IGetProfile {
    name: string;
    surname: string;
    patronymic: string;
    city: string;
    institution: string;
}

export interface IProfileResponse {
    id: 0;
    name: "string";
    surname: "string";
    patronymic: "string";
    city: "string";
    institution: "string";
    checksAvailable: 0;
}
