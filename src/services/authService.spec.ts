import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthResponse } from '../types/auth';
import authService from './authService';
import { post } from './requester';

vi.mock('./requester', () => ({ post: vi.fn() }));

const postMock = vi.mocked(post);
const user = { id: 'user-1', firstName: 'Pencho', lastName: 'Dimitrov', email: 'pencho@test.com', role: 'student' as const };
const authResponse: AuthResponse = { success: true, message: 'Logged in.', user, accessToken: 'access-token' };

describe('authService', () => {
    let storage: Map<string, string>;

    beforeEach(() => {
        storage = new Map();

        vi.stubGlobal('localStorage', {
            getItem: (key: string) => storage.get(key) ?? null,
            setItem: (key: string, value: string) => storage.set(key, value),
            removeItem: (key: string) => storage.delete(key),
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        postMock.mockReset();
    });

    describe('register', () => {
        const registerData = { firstName: 'Pencho', lastName: 'Dimitrov', email: 'pencho@test.com', password: 'password', confirmPassword: 'password' };

        it('registers without a token and stores the returned token and user', async () => {
            postMock.mockResolvedValue(authResponse);
            const result = await authService.register(registerData);

            expect(postMock).toHaveBeenCalledWith('/auth/register', { auth: false, body: registerData });
            expect(storage.get('accessToken')).toBe('access-token');
            expect(storage.get('user')).toBe(JSON.stringify(user));
            expect(result).toBe(authResponse);
        });
    });

    describe('login', () => {
        const loginData = { email: 'pencho@test.com', password: 'password' };

        it('logs in without a token and stores the returned token and user', async () => {
            postMock.mockResolvedValue(authResponse);
            const result = await authService.login(loginData);

            expect(postMock).toHaveBeenCalledWith('/auth/login', { auth: false, body: loginData });
            expect(storage.get('accessToken')).toBe('access-token');
            expect(storage.get('user')).toBe(JSON.stringify(user));
            expect(result).toBe(authResponse);
        });

        it('only stores the token when the response has no user', async () => {
            postMock.mockResolvedValue({ ...authResponse, user: null });
            await authService.login(loginData);

            expect(storage.get('accessToken')).toBe('access-token');
            expect(storage.has('user')).toBe(false);
        });

        it('stores nothing when the login fails', async () => {
            postMock.mockRejectedValue(new Error('Invalid credentials.'));

            await expect(authService.login(loginData)).rejects.toThrow('Invalid credentials.');
            expect(storage.size).toBe(0);
        });
    });

    describe('logout', () => {
        it('removes the stored token and user', () => {
            storage.set('accessToken', 'access-token');
            storage.set('user', JSON.stringify(user));

            authService.logout();

            expect(storage.size).toBe(0);
        });
    });

    describe('getCurrentUser', () => {
        it('returns the stored user', () => {
            storage.set('user', JSON.stringify(user));

            expect(authService.getCurrentUser()).toEqual(user);
        });

        it('returns null when no user is stored', () => {
            expect(authService.getCurrentUser()).toBeNull();
        });
    });

    describe('password reset', () => {
        const messageResponse = { success: true, message: 'Done.' };

        beforeEach(() => {
            postMock.mockResolvedValue(messageResponse);
        });

        it('requests a reset code without a token', async () => {
            const result = await authService.forgotPassword({ email: 'pencho@test.com' });

            expect(postMock).toHaveBeenCalledWith('/auth/forgot-password', { auth: false, body: { email: 'pencho@test.com' } });
            expect(result).toBe(messageResponse);
        });

        it('verifies the reset code without a token', async () => {
            const data = { email: 'pencho@test.com', code: '123456' };
            const result = await authService.verifyResetCode(data);

            expect(postMock).toHaveBeenCalledWith('/auth/verify-reset-code', { auth: false, body: data });
            expect(result).toBe(messageResponse);
        });

        it('resets the password without a token', async () => {
            const data = { email: 'pencho@test.com', code: '123456', newPassword: 'new-password', confirmNewPassword: 'new-password' };
            const result = await authService.resetPassword(data);

            expect(postMock).toHaveBeenCalledWith('/auth/reset-password', { auth: false, body: data });
            expect(result).toBe(messageResponse);
        });

        it('does not touch the stored auth data', async () => {
            await authService.forgotPassword({ email: 'pencho@test.com' });

            expect(storage.size).toBe(0);
        });
    });
});