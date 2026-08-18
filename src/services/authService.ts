import type { AuthResponse, ForgotPasswordData, LoginData, MessageResponse, RegisterData, ResetPasswordData, VerifyResetCodeData } from '../types/auth';
import { post } from './requester';

const saveAuthData = (data: AuthResponse) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
    }
};

const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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

const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        clearAuthData();
        return;
    }

    try {
        return await post<AuthResponse>('/auth/logout', {
            auth: false,
            body: { refreshToken }
        });
    } finally {
        clearAuthData();
    }
};

const refresh = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        clearAuthData();
        throw new Error('No refresh token found.');
    }

    let data: AuthResponse;

    try {
        data = await post<AuthResponse>('/auth/refresh', {
            auth: false,
            body: { refreshToken }
        });
    } catch (error) {
        clearAuthData();
        throw error;
    }

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data;
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

const authService = { register, login, logout, refresh, forgotPassword, verifyResetCode, resetPassword };
export default authService;