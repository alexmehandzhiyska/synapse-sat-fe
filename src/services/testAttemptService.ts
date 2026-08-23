import type { ScoreDistribution, ScoreReport } from '../types/score';
import type { TestAttempt, TestResult } from '../types/testAttempt';
import { get, post, put } from './requester';

const getAllCompleted = (): Promise<TestResult[]> =>
    get<TestResult[]>('/test-attempts', { auth: true });

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

const getScoreDistribution = (attemptId: string): Promise<ScoreDistribution> =>
    get<ScoreDistribution>(`/test-attempts/${attemptId}/score-distribution`, { auth: true });

const testAttemptService = { getAllCompleted, startOrResume, upsertAnswer, advanceModule, submit, getScore, getScoreDistribution };

export default testAttemptService;