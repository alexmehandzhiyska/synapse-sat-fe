export type TestAttemptStatus = 'in_progress' | 'completed';

export interface AttemptAnswer {
    questionId: string;
    selectedChoiceId: string | null;
}

export interface TestAttempt {
    id: string;
    testId: string;
    status: TestAttemptStatus;
    answers: AttemptAnswer[];
}