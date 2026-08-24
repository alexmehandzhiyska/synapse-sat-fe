import type { Domain } from './practiceTest';

export interface Lesson {
    id: string;
    domain: Domain;
    title: string;
    videoUrl: string;
}

export type CreateLessonData = {
    title: string;
    videoUrl: string;
};