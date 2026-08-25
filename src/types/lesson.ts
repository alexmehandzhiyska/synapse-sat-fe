import type { Domain } from './practiceTest';

export type LessonProgressStatus = 'complete' | 'current' | 'locked';

export interface Lesson {
    id: string;
    domain: Domain;
    title: string;
    videoUrl: string;
};

export interface LessonWithProgress extends Lesson {
    isWatched: boolean;
};

export interface DomainProgress {
    domain: Domain;
    status: LessonProgressStatus;
    lessons: LessonWithProgress[];
};

export type CreateLessonData = {
    title: string;
    videoUrl: string;
};