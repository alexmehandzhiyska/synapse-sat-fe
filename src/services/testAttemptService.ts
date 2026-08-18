import type { ScoreReport } from '../types/score';
import type { TestAttempt } from '../types/testAttempt';
import { get, post, put } from './requester';

const startOrResume = (testId: string): Promise<TestAttempt> =>
    post<TestAttempt>('/test-attempts', { body: { testId } });

const upsertAnswer = (
    attemptId: string,
    questionId: string,
    selectedChoiceId: string | null,
): Promise<void> =>
    put<void>(`/test-attempts/${attemptId}/answers/${questionId}`, {
        body: { selectedChoiceId },
    });

const advanceModule = (attemptId: string): Promise<TestAttempt> =>
    post<TestAttempt>(`/test-attempts/${attemptId}/advance-module`);

const submit = (attemptId: string): Promise<TestAttempt> =>
    post<TestAttempt>(`/test-attempts/${attemptId}/submit`);

const getScore = (attemptId: string): Promise<ScoreReport> =>
    get<ScoreReport>(`/test-attempts/${attemptId}/score`, { auth: true });

const testAttemptService = { startOrResume, upsertAnswer, advanceModule, submit, getScore };

export default testAttemptService;