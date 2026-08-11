export type PracticeTestType = 'diagnostic' | 'standard';
export type SectionName = 'reading_writing' | 'math';

export interface PracticeTest {
    id: string;
    title: string;
    type: PracticeTestType;
    createdAt: string;
    updatedAt: string;
}

export interface AnswerChoice {
    id: string;
    label: string;
    content: string;
}

export interface Question {
    id: string;
    position: number;
    domain: string;
    difficulty: string;
    passage: string | null;
    prompt: string;
    answerChoices: AnswerChoice[];
}

export interface Module {
    id: string;
    position: number;
    questions: Question[];
}

export interface Section {
    id: string;
    name: SectionName;
    directions: string | null;
    modules: Module[];
}

export interface FullPracticeTest extends PracticeTest {
    sections: Section[];
}