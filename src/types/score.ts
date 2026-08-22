import type { Difficulty, Domain, SectionName } from './practiceTest';

export type QuestionStatus = 'correct' | 'incorrect' | 'omitted';

export interface AnswerChoiceResult {
    id: string;
    label: string;
    content: string;
    isCorrect: boolean;
}

export interface QuestionResult {
    id: string;
    position: number;
    status: QuestionStatus;
    domain: Domain;
    difficulty: Difficulty;
    passage: string | null;
    prompt: string;
    selectedChoiceId: string | null;
    answerChoices: AnswerChoiceResult[];
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