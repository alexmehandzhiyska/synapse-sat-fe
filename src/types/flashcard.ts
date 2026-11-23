export interface Flashcard {
    id: string;
    questionId: string | null;
    word: string;
    definition: string;
    context: string | null;
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