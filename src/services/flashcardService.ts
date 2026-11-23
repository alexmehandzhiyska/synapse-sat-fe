import type { CreateFlashcardData, Flashcard, FlashcardRating, SuggestedDefinition } from '../types/flashcard';
import { get, patch, post } from './requester';

const getAll = (): Promise<Flashcard[]> =>
    get<Flashcard[]>('/flashcards', { auth: true });

const create = (data: CreateFlashcardData): Promise<Flashcard> =>
    post<Flashcard>('/flashcards', { body: data });

const getSuggestedDefinition = (word: string): Promise<SuggestedDefinition> =>
    get<SuggestedDefinition>(`/flashcards/definition?word=${encodeURIComponent(word)}`, { auth: true });

const review = (id: string, rating: FlashcardRating): Promise<Flashcard> =>
    patch<Flashcard>(`/flashcards/${id}/review`, { body: { rating } });

const flashcardService = { getAll, create, getSuggestedDefinition, review };

export default flashcardService;