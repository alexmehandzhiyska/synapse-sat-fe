export type PracticeTestType = 'diagnostic' | 'standard' | 'check_in';
export type SectionName = 'reading_writing' | 'math';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Domain =
    'information_and_ideas'
    | 'craft_and_structure'
    | 'expression_of_ideas'
    | 'standard_english_conventions'
    | 'algebra'
    | 'advanced_math'
    | 'problem_solving_and_data_analysis'
    | 'geometry_and_trigonometry';

export interface PracticeTest {
    id: string;
    title: string;
    type: PracticeTestType;
    createdAt: string;
    updatedAt: string;
}

export type CreatePracticeTestData = {
    title: string;
    type: PracticeTestType;
}

export interface AnswerChoice {
    id: string;
    label: string;
    content: string;
    isCorrect?: boolean;
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

export type CreateAnswerChoiceData = {
    label: string;
    content: string;
    isCorrect: boolean;
}

export type CreateQuestionData = {
    domain: Domain;
    passage?: string;
    prompt: string;
    difficulty: Difficulty;
    answerChoices: CreateAnswerChoiceData[];
}

export type UpdateAnswerChoiceData = {
    id: string;
    content: string;
    isCorrect: boolean;
}

export type UpdateQuestionData = {
    domain: Domain;
    passage?: string;
    prompt: string;
    difficulty: Difficulty;
    answerChoices: UpdateAnswerChoiceData[];
}