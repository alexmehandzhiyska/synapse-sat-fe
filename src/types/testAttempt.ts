import type { ModuleVariant, SectionName } from './practiceTest';

export type TestAttemptStatus = 'in_progress' | 'completed';

export interface AttemptAnswer {
    questionId: string;
    selectedChoiceId: string | null;
}

// Which module 2 the student was routed to in each section of a full test
export type ModuleRoutes = Partial<Record<SectionName, ModuleVariant>>;

export interface TestAttempt {
    id: string;
    testId: string;
    status: TestAttemptStatus;
    currentModuleIndex: number;
    moduleSecondsRemaining: number | null;
    moduleRoutes: ModuleRoutes;
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