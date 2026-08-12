import type { FullPracticeTest, PracticeTest } from '../types/practiceTest';
import { get } from './requester';

const getAll = (): Promise<PracticeTest[]> =>
    get<PracticeTest[]>('/practice-test');

const getOne = (id: string): Promise<FullPracticeTest> =>
    get<FullPracticeTest>(`/practice-test/${id}`, { auth: true });

const practiceTestService = { getAll, getOne };

export default practiceTestService;