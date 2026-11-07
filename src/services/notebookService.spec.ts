import { beforeEach, describe, expect, it, vi } from 'vitest';

import notebookService from './notebookService';
import { del, get, patch, post } from './requester';

vi.mock('./requester', () => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn(), del: vi.fn() }));

describe('notebookService', () => {
    beforeEach(() => {
        vi.mocked(get).mockReset().mockResolvedValue('get-result');
        vi.mocked(post).mockReset().mockResolvedValue('post-result');
        vi.mocked(patch).mockReset().mockResolvedValue('patch-result');
        vi.mocked(del).mockReset().mockResolvedValue(undefined);
    });

    describe('getAll', () => {
        it('fetches notebook entries with token', async () => {
            const result = await notebookService.getAll();

            expect(get).toHaveBeenCalledWith('/notebook', { auth: true });
            expect(result).toBe('get-result');
        });
    });

    describe('create', () => {
        it('creates entry', async () => {
            const data = { questionId: 'question-1', what: 'what', why: 'why', how: 'how' };
            const result = await notebookService.create(data);

            expect(post).toHaveBeenCalledWith('/notebook', { body: data });
            expect(result).toBe('post-result');
        });
    });

    describe('update', () => {
        it('updates entry', async () => {
            const data = { what: 'what', why: 'why', how: 'how' };
            const result = await notebookService.update('entry-1', data);

            expect(patch).toHaveBeenCalledWith('/notebook/entry-1', { body: data });
            expect(result).toBe('patch-result');
        });
    });

    describe('remove', () => {
        it('deletes entry', async () => {
            await notebookService.remove('entry-1');

            expect(del).toHaveBeenCalledWith('/notebook/entry-1');
        });
    });
});