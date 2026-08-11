import type { FullPracticeTest, PracticeTest } from '../types/practiceTest';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAll = async (): Promise<PracticeTest[]> => {
    const response = await fetch(`${BASE_URL}/practice-test`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data);
    }

    return data;
};

const getOne = async (id: string): Promise<FullPracticeTest> => {
    const response = await fetch(`${BASE_URL}/practice-test/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error loading the practice test.');
    }

    return data;
};

const practiceTestService = { getAll, getOne };

export default practiceTestService;