import type { PracticeTest } from '../types/practiceTest';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAll = async (): Promise<PracticeTest[]> => {
    const response = await fetch(`${BASE_URL}/practice-test`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data);
    }

    return data;
};

const practiceTestService = { getAll };

export default practiceTestService;
