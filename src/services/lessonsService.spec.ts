import { beforeEach, describe, expect, it, vi } from 'vitest';

import lessonsService from './lessonsService';
import { del, get, patch, post } from './requester';

vi.mock('./requester', () => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn(), del: vi.fn() }));

describe('lessonsService', () => {
    beforeEach(() => {
        vi.mocked(get).mockReset().mockResolvedValue('get-result');
        vi.mocked(post).mockReset().mockResolvedValue('post-result');
        vi.mocked(patch).mockReset().mockResolvedValue('patch-result');
        vi.mocked(del).mockReset().mockResolvedValue(undefined);
    });

    describe('getAll', () => {
        it('fetches all lessons with token', async () => {
            const result = await lessonsService.getAll();

            expect(get).toHaveBeenCalledWith('/lessons', { auth: true });
            expect(result).toBe('get-result');
        });
    });

    describe('createLesson', () => {
        it('adds lesson to given domain', async () => {
            const data = { title: 'Lesson 1', videoUrl: 'https://www.youtube.com/watch?v=video-1' };
            const result = await lessonsService.createLesson('algebra', data);

            expect(post).toHaveBeenCalledWith('/lessons/domains/algebra', { body: data });
            expect(result).toBe('post-result');
        });
    });

    describe('updateLesson', () => {
        it('updates lesson', async () => {
            const data = { title: 'Lesson 1', videoUrl: 'https://www.youtube.com/watch?v=video-1' };
            const result = await lessonsService.updateLesson('lesson-1', data);

            expect(patch).toHaveBeenCalledWith('/lessons/lesson-1', { body: data });
            expect(result).toBe('patch-result');
        });
    });

    describe('deleteLesson', () => {
        it('deletes lesson', async () => {
            await lessonsService.deleteLesson('lesson-1');

            expect(del).toHaveBeenCalledWith('/lessons/lesson-1');
        });
    });

    describe('getProgress', () => {
        it('fetches lesson progress with token', async () => {
            const result = await lessonsService.getProgress();

            expect(get).toHaveBeenCalledWith('/lessons/progress', { auth: true });
            expect(result).toBe('get-result');
        });
    });

    describe('completeLesson', () => {
        it('marks lesson as watched', async () => {
            await lessonsService.completeLesson('lesson-1');

            expect(post).toHaveBeenCalledWith('/lessons/lesson-1/complete');
        });
    });
})