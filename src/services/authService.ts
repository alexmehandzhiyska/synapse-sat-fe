import type { AuthResponse, LoginData, RegisterData } from '../types/auth';
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

const authService = { register, login, logout, refresh };
export default authService;