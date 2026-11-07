import { beforeEach, describe, expect, it, vi } from 'vitest';

import { get, put } from './requester';
import studyPlanService from './studyPlanService';

vi.mock('./requester', () => ({ get: vi.fn(), put: vi.fn() }));

describe('studyPlanService', () => {
    beforeEach(() => {
        vi.mocked(get).mockReset().mockResolvedValue('get-result');
        vi.mocked(put).mockReset().mockResolvedValue('put-result');
    });

    describe('getTestDates', () => {
        it('fetches test dates with token', async () => {
            const result = await studyPlanService.getTestDates();

            expect(get).toHaveBeenCalledWith('/study-plan/test-dates', { auth: true });
            expect(result).toBe('get-result');
        });
    });

    describe('getOne', () => {
        it('fetches study plan with token', async () => {
            const result = await studyPlanService.getOne();

            expect(get).toHaveBeenCalledWith('/study-plan', { auth: true });
            expect(result).toBe('get-result');
        });
    });

    describe('upsert', () => {
        it('saves study plan', async () => {
            const data = { goalScore: 1200, prepStartDate: '2026-09-01', testDate: '2026-12-05' };
            const result = await studyPlanService.upsert(data);

            expect(put).toHaveBeenCalledWith('/study-plan', { body: data });
            expect(result).toBe('put-result');
        });
    });
});