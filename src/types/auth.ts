export type RegisterData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type LoginData = {
    email: string;
    password: string;
}

type AuthUser = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export type AuthResponse = {
    success: boolean;
    message: string;
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}
