import type { CreateFlashcardData, Flashcard, SuggestedDefinition } from '../types/flashcard';
import { get, post } from './requester';

const getAll = (): Promise<Flashcard[]> =>
    get<Flashcard[]>('/flashcards', { auth: true });

const create = (data: CreateFlashcardData): Promise<Flashcard> =>
    post<Flashcard>('/flashcards', { body: data });

const getSuggestedDefinition = (word: string): Promise<SuggestedDefinition> =>
    get<SuggestedDefinition>(`/flashcards/definition?word=${encodeURIComponent(word)}`, { auth: true });

const flashcardService = { getAll, create, getSuggestedDefinition };

export default flashcardService;