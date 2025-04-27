export interface IPostLogin {
    login: string;
    password: string;
}

export interface IPostLoginResponse {
    accessToken: string;
    expiresIn: number;
}

export interface IPostRegister {
    email: string;
    password: string;
    name: string;
}
