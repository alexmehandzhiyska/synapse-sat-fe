import type { CreateLessonData, DomainProgress, Lesson, UpdateLessonData } from '../types/lesson';
import type { Domain } from '../types/practiceTest';
import { del, get, patch, post } from './requester';

const getAll = (): Promise<Lesson[]> =>
    get<Lesson[]>('/lessons', { auth: true });

const createLesson = (domain: Domain, data: CreateLessonData): Promise<Lesson> =>
    post<Lesson>(`/lessons/domains/${domain}`, { body: data });

const updateLesson = (lessonId: string, data: UpdateLessonData): Promise<Lesson> =>
    patch<Lesson>(`/lessons/${lessonId}`, { body: data });

const deleteLesson = (lessonId: string): Promise<void> =>
    del<void>(`/lessons/${lessonId}`);

const getProgress = (): Promise<DomainProgress[]> =>
    get<DomainProgress[]>('/lessons/progress', { auth: true });

const completeLesson = (lessonId: string): Promise<void> =>
    post<void>(`/lessons/${lessonId}/complete`);

const lessonsService = { getAll, createLesson, updateLesson, deleteLesson, getProgress, completeLesson };

export default lessonsService;