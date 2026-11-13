import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { QuestionResult, SectionScore } from '../../../types/score';
import SectionBreakdown from './SectionBreakdown';

vi.mock('./SectionSkillsRadar', () => ({
    default: ({ color }: { color: string }) => <div data-testid="skills-radar" data-color={color} />,
}));

vi.mock('./QuestionDetailsTable', () => ({
    default: ({ section }: { section: SectionScore }) => <div data-testid="details-table">{section.name}</div>,
}));

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

const section: SectionScore = {
    name: 'math',
    raw: 30,
    total: 44,
    scaled: 650,
    modules: [
        { position: 1, correct: 1, incorrect: 0, omitted: 0, total: 1, questions: [question] },
        { position: 2, correct: 0, incorrect: 0, omitted: 0, total: 0, questions: [] },
    ],
    domains: [
        { domain: 'algebra', correct: 10, total: 13 },
        { domain: 'geometry_and_trigonometry', correct: 4, total: 6 },
    ],
};

const renderBreakdown = () => {
    const onSelectQuestion = vi.fn();

    render(<SectionBreakdown section={section} onSelectQuestion={onSelectQuestion} />);

    return { onSelectQuestion };
};

describe('SectionBreakdown', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders section label', () => {
        renderBreakdown();

        expect(screen.getByRole('heading', { name: 'Math' })).toBeInTheDocument();
    });

    it('renders scaled score and raw score', () => {
        renderBreakdown();

        expect(screen.getByText('650')).toBeInTheDocument();
        expect(screen.getByText('30 / 44 correct')).toBeInTheDocument();
    });

    it('renders one card per module', () => {
        renderBreakdown();

        expect(screen.getByRole('heading', { name: 'Module 1' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Module 2' })).toBeInTheDocument();
    });

    it('renders one card per domain', () => {
        renderBreakdown();

        expect(screen.getByRole('heading', { name: 'Algebra' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Geometry and Trigonometry' })).toBeInTheDocument();
    });

    it('colors skills radar by section', () => {
        renderBreakdown();

        expect(screen.getByTestId('skills-radar')).toHaveAttribute('data-color', '#eb6834');
    });

    it('renders question details table for section', () => {
        renderBreakdown();

        expect(screen.getByTestId('details-table')).toHaveTextContent('math');
    });

    it('passes question selection to onSelectQuestion', () => {
        const { onSelectQuestion } = renderBreakdown();

        fireEvent.click(screen.getByTitle('Question 1: correct'));

        expect(onSelectQuestion).toHaveBeenCalledWith(question);
    });
});