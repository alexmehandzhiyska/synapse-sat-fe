import { beforeEach, describe, expect, it, vi } from 'vitest';

import { get, patch } from './requester';
import userService from './userService';

vi.mock('./requester', () => ({ get: vi.fn(), patch: vi.fn() }));

describe('userService', () => {
    beforeEach(() => {
        vi.mocked(get).mockReset().mockResolvedValue('get-result');
        vi.mocked(patch).mockReset().mockResolvedValue('patch-result');
    });

    describe('getProfile', () => {
        it('fetches profile with token', async () => {
            const result = await userService.getProfile();

            expect(get).toHaveBeenCalledWith('/auth/me', { auth: true });
            expect(result).toBe('get-result');
        });
    });

    describe('update', () => {
        it('updates profile', async () => {
            const data = { firstName: 'Pencho', lastName: 'Dimitrov', school: 'SMG' };
            const result = await userService.update(data);

            expect(patch).toHaveBeenCalledWith('/auth/me', { body: data });
            expect(result).toBe('patch-result');
        });
    });
});