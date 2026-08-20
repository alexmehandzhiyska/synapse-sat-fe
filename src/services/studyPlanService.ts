import type { StudyPlanData } from '../types/studyPlan';
import { get, put } from './requester';

const getTestDates = async () => {
    return await get<string[]>('/study-plan/test-dates', { auth: true });
};

const upsert = async (data: StudyPlanData) => {
    return await put<StudyPlanData>('/study-plan', { body: data });
};

const studyPlanService = { getTestDates, upsert };
export default studyPlanService;