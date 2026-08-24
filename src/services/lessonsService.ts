import type { CreateLessonData, Lesson } from '../types/lesson';
import type { Domain } from '../types/practiceTest';
import { get, post } from './requester';

const getAll = (): Promise<Lesson[]> =>
    get<Lesson[]>('/lessons', { auth: true });

const createLesson = (domain: Domain, data: CreateLessonData): Promise<Lesson> =>
    post<Lesson>(`/lessons/domains/${domain}`, { body: data });

const lessonsService = { getAll, createLesson };

export default lessonsService;