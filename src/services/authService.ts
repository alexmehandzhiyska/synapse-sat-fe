import type { AuthResponse, ForgotPasswordData, LoginData, MessageResponse, RegisterData, ResetPasswordData, VerifyResetCodeData } from '../types/auth';
import { post } from './requester';

const saveAuthData = (data: AuthResponse) => {
    localStorage.setItem('accessToken', data.accessToken);

    if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
    }
};

const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
};

const register = async (user: RegisterData) => {
    const data = await post<AuthResponse>('/auth/register', {
        auth: false,
        body: user
    });

    saveAuthData(data);

    return data;
};

const login = async (user: LoginData) => {
    const data = await post<AuthResponse>('/auth/login', {
        auth: false,
        body: user
    });

    saveAuthData(data);

    return data;
};

const logout = () => {
    clearAuthData();
};

const forgotPassword = async (data: ForgotPasswordData) => {
    return await post<MessageResponse>('/auth/forgot-password', {
        auth: false,
        body: data
    });
};

const verifyResetCode = async (data: VerifyResetCodeData) => {
    return await post<MessageResponse>('/auth/verify-reset-code', {
        auth: false,
        body: data
    });
};

const resetPassword = async (data: ResetPasswordData) => {
    return await post<MessageResponse>('/auth/reset-password', {
        auth: false,
        body: data
    });
};

const authService = { register, login, logout, forgotPassword, verifyResetCode, resetPassword };
export default authService;