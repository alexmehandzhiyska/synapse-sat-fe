import type { StudyPlanData } from '../types/studyPlan';
import { put } from './requester';

const upsert = async (data: StudyPlanData) => {
    return await put<StudyPlanData>('/study-plan', { body: data });
};

const studyPlanService = { upsert };
export default studyPlanService;