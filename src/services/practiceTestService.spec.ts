import { beforeEach, describe, expect, it, vi } from 'vitest';

import practiceTestService from './practiceTestService';
import { del, get, patch, post } from './requester';

vi.mock('./requester', () => ({ get: vi.fn(), post: vi.fn(), patch: vi.fn(), del: vi.fn() }));

describe('practiceTestService', () => {
    beforeEach(() => {
        vi.mocked(get).mockReset().mockResolvedValue('get-result');
        vi.mocked(post).mockReset().mockResolvedValue('post-result');
        vi.mocked(patch).mockReset().mockResolvedValue('patch-result');
        vi.mocked(del).mockReset().mockResolvedValue(undefined);
    });

    describe('getAll', () => {
        it('fetches every practice test without a token', async () => {
            const result = await practiceTestService.getAll();

            expect(get).toHaveBeenCalledWith('/practice-test');
            expect(result).toBe('get-result');
        });
    });

    describe('getOne', () => {
        it('fetches the given practice test with a token', async () => {
            const result = await practiceTestService.getOne('test-1');

            expect(get).toHaveBeenCalledWith('/practice-test/test-1', { auth: true });
            expect(result).toBe('get-result');
        });
    });

    describe('getDiagnostic', () => {
        it('fetches the diagnostic test with a token', async () => {
            const result = await practiceTestService.getDiagnostic();

            expect(get).toHaveBeenCalledWith('/practice-test/diagnostic', { auth: true });
            expect(result).toBe('get-result');
        });
    });

    describe('create', () => {
        it('creates a practice test', async () => {
            const data = { title: 'Practice Test 1', type: 'standard' as const };
            const result = await practiceTestService.create(data);

            expect(post).toHaveBeenCalledWith('/practice-test', { body: data });
            expect(result).toBe('post-result');
        });
    });

    describe('generateCustomPacket', () => {
        it('generates a custom packet', async () => {
            const data = { section: 'math' as const, domains: [], difficulties: [], statuses: [], count: 10 };
            const result = await practiceTestService.generateCustomPacket(data);

            expect(post).toHaveBeenCalledWith('/practice-test/custom-packet', { body: data });
            expect(result).toBe('post-result');
        });
    });

    describe('createQuestion', () => {
        it('adds a question to the given module', async () => {
            const data = {
                domain: 'algebra' as const,
                prompt: 'A prompt',
                difficulty: 'easy' as const,
                answerChoices: [
                    { label: 'A', content: 'choice-a', isCorrect: true },
                    { label: 'B', content: 'choice-b', isCorrect: false },
                ],
            };

            const result = await practiceTestService.createQuestion('module-1', data);

            expect(post).toHaveBeenCalledWith('/practice-test/modules/module-1/questions', { body: data });
            expect(result).toBe('post-result');
        });
    });

    describe('updateQuestion', () => {
        it('updates the given question', async () => {
            const data = {
                domain: 'algebra' as const,
                prompt: 'A prompt',
                difficulty: 'easy' as const,
                answerChoices: [{ id: 'choice-a', content: 'choice-a', isCorrect: true }],
            };

            const result = await practiceTestService.updateQuestion('question-1', data);

            expect(patch).toHaveBeenCalledWith('/practice-test/questions/question-1', { body: data });
            expect(result).toBe('patch-result');
        });
    });

    describe('remove', () => {
        it('deletes the given practice test', async () => {
            await practiceTestService.remove('test-1');

            expect(del).toHaveBeenCalledWith('/practice-test/test-1');
        });
    });
});