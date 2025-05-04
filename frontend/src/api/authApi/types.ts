export interface IPostLogin {
    login: string;
    password: string;
}

export interface IPostLoginResponse {
    accessToken: string;
    expiresIn: number;
    userId: number;
}

export interface IPostRegister {
    email: string;
    password: string;
    name: string;
}

export interface IRefreshResponse {
    userId: number;
}
