import type { CreatePracticeTestData, CreateQuestionData, FullPracticeTest, PracticeTest, Question, UpdateQuestionData } from '../types/practiceTest';
import { get, patch, post } from './requester';

const getAll = (): Promise<PracticeTest[]> =>
    get<PracticeTest[]>('/practice-test');

const getOne = (id: string): Promise<FullPracticeTest> =>
    get<FullPracticeTest>(`/practice-test/${id}`, { auth: true });

const getDiagnostic = (): Promise<PracticeTest> =>
    get<PracticeTest>('/practice-test/diagnostic', { auth: true });

const create = (data: CreatePracticeTestData): Promise<PracticeTest> =>
    post<PracticeTest>('/practice-test', { body: data });

const createQuestion = (moduleId: string, data: CreateQuestionData): Promise<Question> =>
    post<Question>(`/practice-test/modules/${moduleId}/questions`, { body: data });

const updateQuestion = (questionId: string, data: UpdateQuestionData): Promise<Question> =>
    patch<Question>(`/practice-test/questions/${questionId}`, { body: data });

const practiceTestService = { getAll, getOne, getDiagnostic, create, createQuestion, updateQuestion };

export default practiceTestService;