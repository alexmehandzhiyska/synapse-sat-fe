import type { SectionName } from './practiceTest';

export type TestAttemptStatus = 'in_progress' | 'completed';

export interface AttemptAnswer {
    questionId: string;
    selectedChoiceId: string | null;
}

export interface TestAttempt {
    id: string;
    testId: string;
    status: TestAttemptStatus;
    currentModuleIndex: number;
    answers: AttemptAnswer[];
}

export interface TestResultSectionScore {
    name: SectionName;
    scaled: number;
}

export interface TestResult {
    id: string;
    testId: string;
    testTitle: string;
    completedAt: string;
    totalScaled: number;
    sections: TestResultSectionScore[];
}