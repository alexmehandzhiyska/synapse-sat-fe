export interface Flashcard {
    id: string;
    questionId: string | null;
    word: string;
    definition: string;
    context: string | null;
    intervalDays: number;
    dueAt: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateFlashcardData = {
    word: string;
    definition: string;
    context?: string;
    questionId?: string;
};

export interface SuggestedDefinition {
    definition: string | null;
}

export type FlashcardRating = 'forgot' | 'knew_it';