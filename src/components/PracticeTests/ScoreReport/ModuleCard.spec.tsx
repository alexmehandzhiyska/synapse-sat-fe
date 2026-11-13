import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { ModuleScore, QuestionResult } from '../../../types/score';
import ModuleCard from './ModuleCard';

const question: QuestionResult = {
    id: 'question-1',
    position: 1,
    status: 'correct',
    domain: 'algebra',
    difficulty: 'easy',
    passage: null,
    prompt: 'Prompt',
    selectedChoiceId: null,
    answerChoices: [],
};

const module: ModuleScore = {
    position: 2,
    correct: 5,
    incorrect: 3,
    omitted: 1,
    total: 9,
    questions: [question],
};

const renderCard = () => {
    const onSelectQuestion = vi.fn();

    render(<ModuleCard module={module} onSelectQuestion={onSelectQuestion} />);

    return { onSelectQuestion };
};

describe('ModuleCard', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders module position', () => {
        renderCard();

        expect(screen.getByRole('heading', { name: 'Module 2' })).toBeInTheDocument();
    });

    it('renders correct out of total', () => {
        renderCard();

        expect(screen.getByText('/ 9')).toBeInTheDocument();
    });

    it('renders correct, incorrect and omitted counts', () => {
        renderCard();

        expect(screen.getByText('5 correct')).toBeInTheDocument();
        expect(screen.getByText('3 incorrect')).toBeInTheDocument();
        expect(screen.getByText('1 omitted')).toBeInTheDocument();
    });

    it('passes question selection to onSelectQuestion', () => {
        const { onSelectQuestion } = renderCard();

        fireEvent.click(screen.getByTitle('Question 1: correct'));

        expect(onSelectQuestion).toHaveBeenCalledWith(question);
    });
});