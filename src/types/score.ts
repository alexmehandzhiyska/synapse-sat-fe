import type { SectionName } from './practiceTest';

export type QuestionStatus = 'correct' | 'incorrect' | 'omitted';

export interface QuestionResult {
    position: number;
    status: QuestionStatus;
}

export interface ModuleScore {
    position: number;
    correct: number;
    incorrect: number;
    omitted: number;
    total: number;
    questions: QuestionResult[];
}

export interface DomainScore {
    domain: string;
    correct: number;
    total: number;
}

export interface SectionScore {
    name: SectionName;
    raw: number;
    total: number;
    scaled: number;
    modules: ModuleScore[];
    domains: DomainScore[];
}

export interface ScoreReport {
    attemptId: string;
    isDiagnostic: boolean;
    totalRaw: number;
    totalScaled: number;
    sections: SectionScore[];
}