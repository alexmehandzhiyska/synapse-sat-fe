import type { CreateFlashcardData, Flashcard, FlashcardRating, SuggestedDefinition } from '../types/flashcard';
import { del, get, patch, post } from './requester';

const getAll = (): Promise<Flashcard[]> =>
    get<Flashcard[]>('/flashcards', { auth: true });

const create = (data: CreateFlashcardData): Promise<Flashcard> =>
    post<Flashcard>('/flashcards', { body: data });

const getSuggestedDefinition = (word: string): Promise<SuggestedDefinition> =>
    get<SuggestedDefinition>(`/flashcards/definition?word=${encodeURIComponent(word)}`, { auth: true });

const review = (id: string, rating: FlashcardRating): Promise<Flashcard> =>
    patch<Flashcard>(`/flashcards/${id}/review`, { body: { rating } });

const update = (id: string, definition: string): Promise<Flashcard> =>
    patch<Flashcard>(`/flashcards/${id}`, { body: { definition } });

const remove = (id: string): Promise<void> =>
    del<void>(`/flashcards/${id}`);

const flashcardService = { getAll, create, getSuggestedDefinition, review, update, remove };

export default flashcardService;