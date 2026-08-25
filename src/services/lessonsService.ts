import type { CreateLessonData, DomainProgress, Lesson } from '../types/lesson';
import type { Domain } from '../types/practiceTest';
import { get, post } from './requester';

const getAll = (): Promise<Lesson[]> =>
    get<Lesson[]>('/lessons', { auth: true });

const createLesson = (domain: Domain, data: CreateLessonData): Promise<Lesson> =>
    post<Lesson>(`/lessons/domains/${domain}`, { body: data });

const getProgress = (): Promise<DomainProgress[]> =>
    get<DomainProgress[]>('/lessons/progress', { auth: true });

const completeLesson = (lessonId: string): Promise<void> =>
    post<void>(`/lessons/${lessonId}/complete`);

const lessonsService = { getAll, createLesson, getProgress, completeLesson };

export default lessonsService;