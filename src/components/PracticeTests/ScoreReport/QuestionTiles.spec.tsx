import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { QuestionResult, QuestionStatus } from '../../../types/score';
import QuestionTiles from './QuestionTiles';

const createQuestion = (position: number, status: QuestionStatus): QuestionResult => ({
    id: `question-${position}`,
    position,
    status,
    domain: 'algebra',
    difficulty: 'easy',
    passage: null,
    prompt: 'Prompt',
    selectedChoiceId: null,
    answerChoices: [],
});

const questions = [createQuestion(1, 'correct'), createQuestion(2, 'incorrect'), createQuestion(3, 'omitted')];

const renderTiles = () => {
    const onSelectQuestion = vi.fn();

    render(<QuestionTiles questions={questions} onSelectQuestion={onSelectQuestion} />);

    return { onSelectQuestion };
};

describe('QuestionTiles', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders one tile per question', () => {
        renderTiles();

        expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('titles tiles with position and status', () => {
        renderTiles();

        expect(screen.getByTitle('Question 1: correct')).toBeInTheDocument();
        expect(screen.getByTitle('Question 2: incorrect')).toBeInTheDocument();
        expect(screen.getByTitle('Question 3: omitted')).toBeInTheDocument();
    });

    it('styles tiles by status', () => {
        renderTiles();

        expect(screen.getByTitle('Question 1: correct')).toHaveClass('bg-emerald-500');
        expect(screen.getByTitle('Question 2: incorrect')).toHaveClass('bg-red-500');
        expect(screen.getByTitle('Question 3: omitted')).toHaveClass('border-dashed');
    });

    it('calls onSelectQuestion with clicked question', () => {
        const { onSelectQuestion } = renderTiles();

        fireEvent.click(screen.getByTitle('Question 2: incorrect'));

        expect(onSelectQuestion).toHaveBeenCalledWith(questions[1]);
    });
});