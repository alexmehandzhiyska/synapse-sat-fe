import type { AnswerChoice, Domain } from './practiceTest';

export type NotebookQuestion = {
    id: string;
    prompt: string;
    passage: string | null;
    domain: Domain;
    answerChoices: AnswerChoice[];
}

export type NotebookEntry = {
    id: string;
    questionId: string;
    question: NotebookQuestion;
    what: string;
    why: string;
    how: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateNotebookEntryData = {
    questionId: string;
    what: string;
    why: string;
    how: string;
}

export type UpdateNotebookEntryData = {
    what: string;
    why: string;
    how: string;
}