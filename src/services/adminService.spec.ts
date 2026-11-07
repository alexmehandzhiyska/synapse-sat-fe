import { beforeEach, describe, expect, it, vi } from 'vitest';

import adminService from './adminService';
import { del, get, patch } from './requester';

vi.mock('./requester', () => ({ get: vi.fn(), patch: vi.fn(), del: vi.fn() }));

describe('adminService', () => {
    beforeEach(() => {
        vi.mocked(get).mockReset().mockResolvedValue('get-result');
        vi.mocked(patch).mockReset().mockResolvedValue('patch-result');
        vi.mocked(del).mockReset().mockResolvedValue('del-result');
    });

    describe('getAllUsers', () => {
        it('fetches all users with token', async () => {
            const result = await adminService.getAllUsers();

            expect(get).toHaveBeenCalledWith('/users', { auth: true });
            expect(result).toBe('get-result');
        });
    });

    describe('updateUser', () => {
        it('updates user', async () => {
            const data = { firstName: 'Pencho', lastName: 'Dimitrov', role: 'teacher' as const };
            const result = await adminService.updateUser('user-1', data);

            expect(patch).toHaveBeenCalledWith('/users/user-1', { body: data });
            expect(result).toBe('patch-result');
        });
    });

    describe('deactivateUser', () => {
        it('deactivates user', async () => {
            const result = await adminService.deactivateUser('user-1');

            expect(del).toHaveBeenCalledWith('/users/user-1');
            expect(result).toBe('del-result');
        });
    });

    describe('activateUser', () => {
        it('activates user', async () => {
            const result = await adminService.activateUser('user-1');

            expect(patch).toHaveBeenCalledWith('/users/user-1/activate');
            expect(result).toBe('patch-result');
        });
    });
});