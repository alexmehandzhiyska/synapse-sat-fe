import type { CreatePracticeTestData, FullPracticeTest, PracticeTest } from '../types/practiceTest';
import { get, post } from './requester';

const getAll = (): Promise<PracticeTest[]> =>
    get<PracticeTest[]>('/practice-test');

const getOne = (id: string): Promise<FullPracticeTest> =>
    get<FullPracticeTest>(`/practice-test/${id}`, { auth: true });

const getDiagnostic = (): Promise<PracticeTest> =>
    get<PracticeTest>('/practice-test/diagnostic', { auth: true });

const create = (data: CreatePracticeTestData): Promise<PracticeTest> =>
    post<PracticeTest>('/practice-test', { body: data });

const practiceTestService = { getAll, getOne, getDiagnostic, create };

export default practiceTestService;