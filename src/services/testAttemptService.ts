import type { TestAttempt } from '../types/testAttempt';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
});

const startOrResume = async (testId: string): Promise<TestAttempt> => {
    const response = await fetch(`${BASE_URL}/test-attempts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ testId }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error starting the test.');
    }

    return data;
};

const upsertAnswer = async (
    attemptId: string,
    questionId: string,
    selectedChoiceId: string | null,
): Promise<void> => {
    const response = await fetch(
        `${BASE_URL}/test-attempts/${attemptId}/answers/${questionId}`,
        {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ selectedChoiceId }),
        },
    );

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error saving your answer.');
    }
};

const advanceModule = async (attemptId: string): Promise<TestAttempt> => {
    const response = await fetch(
        `${BASE_URL}/test-attempts/${attemptId}/advance-module`,
        {
            method: 'POST',
            headers: getAuthHeaders(),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error moving to the next module.');
    }

    return data;
};

const submit = async (attemptId: string): Promise<TestAttempt> => {
    const response = await fetch(`${BASE_URL}/test-attempts/${attemptId}/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error submitting the test.');
    }

    return data;
};

const testAttemptService = { startOrResume, upsertAnswer, advanceModule, submit };

export default testAttemptService;