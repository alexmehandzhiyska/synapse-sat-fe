import type { LoginData, RegisterData } from "../types/auth";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const saveAuthData = (data: { accessToken: string; refreshToken: string; user?: unknown }) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
    }
};

const register = async (user: RegisterData) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password
        })
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data);
    }

    saveAuthData(data);

    return data;
};

const login = async (user: LoginData) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data);
    }

    saveAuthData(data);

    return data;
};

const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        clearAuthData();
        return;
    }

    const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
    });
    const data = await res.json();

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    if (!res.ok) {
        throw new Error(data);
    }

    return data;
};

const refresh = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        clearAuthData();
        throw new Error('No refresh token found.');
    }

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
    });

    const data = await res.json();

    if (!res.ok) {
        clearAuthData();
        throw new Error(data);
    }

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    return data;
};

const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
};

const authService = { register, login, logout, refresh };
export default authService;
