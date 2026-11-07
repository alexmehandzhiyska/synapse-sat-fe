import { beforeEach, describe, expect, it, vi } from 'vitest';

import { get, post, put } from './requester';
import testAttemptService from './testAttemptService';

vi.mock('./requester', () => ({ get: vi.fn(), post: vi.fn(), put: vi.fn() }));

describe('testAttemptService', () => {
    beforeEach(() => {
        vi.mocked(get).mockReset().mockResolvedValue('get-result');
        vi.mocked(post).mockReset().mockResolvedValue('post-result');
        vi.mocked(put).mockReset().mockResolvedValue(undefined);
    });

    describe('getAllCompleted', () => {
        it('fetches the completed attempts with token', async () => {
            const result = await testAttemptService.getAllCompleted();

            expect(get).toHaveBeenCalledWith('/test-attempts', { auth: true });
            expect(result).toBe('get-result');
        });
    });

    describe('startOrResume', () => {
        it('starts or resumes the given test', async () => {
            const result = await testAttemptService.startOrResume('test-1');

            expect(post).toHaveBeenCalledWith('/test-attempts', { body: { testId: 'test-1' } });
            expect(result).toBe('post-result');
        });
    });

    describe('upsertAnswer', () => {
        it('saves selected choice for the given question', async () => {
            await testAttemptService.upsertAnswer('attempt-1', 'question-1', 'choice-a');

            expect(put).toHaveBeenCalledWith('/test-attempts/attempt-1/answers/question-1', { body: { selectedChoiceId: 'choice-a' } });
        });

        it('sends null to clear answer', async () => {
            await testAttemptService.upsertAnswer('attempt-1', 'question-1', null);

            expect(put).toHaveBeenCalledWith('/test-attempts/attempt-1/answers/question-1', { body: { selectedChoiceId: null } });
        });
    });

    describe('advanceModule', () => {
        it('advances attempt to the next module', async () => {
            const result = await testAttemptService.advanceModule('attempt-1');

            expect(post).toHaveBeenCalledWith('/test-attempts/attempt-1/advance-module');
            expect(result).toBe('post-result');
        });
    });

    describe('submit', () => {
        it('submits attempt', async () => {
            const result = await testAttemptService.submit('attempt-1');

            expect(post).toHaveBeenCalledWith('/test-attempts/attempt-1/submit');
            expect(result).toBe('post-result');
        });
    });

    describe('getScore', () => {
        it('fetches score of attempt with a token', async () => {
            const result = await testAttemptService.getScore('attempt-1');

            expect(get).toHaveBeenCalledWith('/test-attempts/attempt-1/score', { auth: true });
            expect(result).toBe('get-result');
        });
    });

    describe('getScoreDistribution', () => {
        it('fetches score distribution of attempt with a token', async () => {
            const result = await testAttemptService.getScoreDistribution('attempt-1');

            expect(get).toHaveBeenCalledWith('/test-attempts/attempt-1/score-distribution', { auth: true });
            expect(result).toBe('get-result');
        });
    });
});