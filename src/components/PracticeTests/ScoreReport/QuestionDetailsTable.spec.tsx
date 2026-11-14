import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { QuestionResult, SectionScore } from '../../../types/score';
import QuestionDetailsTable from './QuestionDetailsTable';

const answerChoices = [
    { id: 'choice-a', label: 'A', content: 'choice-a', isCorrect: false },
    { id: 'choice-b', label: 'B', content: 'choice-b', isCorrect: true },
];

const correctQuestion: QuestionResult = {
    id: 'question-1',
    position: 1,
    status: 'correct',
    domain: 'geometry_and_trigonometry',
    difficulty: 'hard',
    passage: null,
    prompt: 'Prompt',
    selectedChoiceId: 'choice-b',
    answerChoices,
};

const incorrectQuestion: QuestionResult = {
    ...correctQuestion,
    id: 'question-2',
    position: 2,
    status: 'incorrect',
    domain: 'algebra',
    difficulty: 'easy',
    selectedChoiceId: 'choice-a',
};

const omittedQuestion: QuestionResult = {
    ...correctQuestion,
    id: 'question-3',
    position: 1,
    status: 'omitted',
    domain: 'advanced_math',
    difficulty: 'medium',
    selectedChoiceId: null,
};

const createSection = (firstModuleQuestions: QuestionResult[], secondModuleQuestions: QuestionResult[]): SectionScore => ({
    name: 'math',
    raw: 0,
    total: 0,
    scaled: 0,
    modules: [
        { position: 1, correct: 0, incorrect: 0, omitted: 0, total: 0, questions: firstModuleQuestions },
        { position: 2, correct: 0, incorrect: 0, omitted: 0, total: 0, questions: secondModuleQuestions },
    ],
    domains: [],
});

const renderTable = (section = createSection([correctQuestion, incorrectQuestion], [omittedQuestion])) => {
    const onSelectQuestion = vi.fn();

    render(<QuestionDetailsTable section={section} onSelectQuestion={onSelectQuestion} />);

    return { onSelectQuestion };
};

const getRows = () => screen.getAllByRole('row').slice(1) as HTMLTableRowElement[];
const getCells = (rowIndex: number) => Array.from(getRows()[rowIndex].cells).map((cell) => cell.textContent);
const getDifficulties = () => getRows().map((row) => row.cells[5].textContent);
const sortBy = (header: string) => {
    fireEvent.click(screen.getByRole('button', { name: header }));
};

describe('QuestionDetailsTable', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders one row per question across modules', () => {
        renderTable();

        expect(getRows()).toHaveLength(3);
    });

    it('renders correct question details', () => {
        renderTable();

        expect(getCells(0)).toEqual(['1', '1', 'Correct', 'B', 'B', 'hard', 'Geometry and Trigonometry']);
    });

    it('renders incorrect question details', () => {
        renderTable();

        expect(getCells(1)).toEqual(['1', '2', 'Incorrect', 'B', 'A', 'easy', 'Algebra']);
    });

    it('renders omitted question details', () => {
        renderTable();

        expect(getCells(2)).toEqual(['2', '1', 'Omit', 'B', 'Omitted', 'medium', 'Advanced Math']);
    });

    it('renders dashes when answer labels are missing', () => {
        renderTable(createSection([{ ...incorrectQuestion, answerChoices: [] }], []));

        expect(getCells(0).slice(3, 5)).toEqual(['—', '—']);
    });

    it('keeps module order before sorting', () => {
        renderTable();

        expect(getDifficulties()).toEqual(['hard', 'easy', 'medium']);
    });

    it('sorts by module descending on second click', () => {
        renderTable();

        sortBy('Module');
        sortBy('Module');

        expect(getDifficulties()).toEqual(['medium', 'hard', 'easy']);
    });

    it('sorts by result', () => {
        renderTable();

        sortBy('Result');

        expect(getDifficulties()).toEqual(['easy', 'hard', 'medium']);
    });

    it('sorts by difficulty', () => {
        renderTable();

        sortBy('Difficulty');

        expect(getDifficulties()).toEqual(['easy', 'medium', 'hard']);
    });

    it('sorts by difficulty descending on second click', () => {
        renderTable();

        sortBy('Difficulty');
        sortBy('Difficulty');

        expect(getDifficulties()).toEqual(['hard', 'medium', 'easy']);
    });

    it('sorts by domain label', () => {
        renderTable();

        sortBy('Domain');

        expect(getDifficulties()).toEqual(['medium', 'easy', 'hard']);
    });

    it('resets to ascending when switching sort field', () => {
        renderTable();

        sortBy('Difficulty');
        sortBy('Difficulty');
        sortBy('Domain');

        expect(getDifficulties()).toEqual(['medium', 'easy', 'hard']);
    });

    it('highlights active sort header', () => {
        renderTable();

        sortBy('Domain');

        expect(screen.getByRole('button', { name: 'Domain' })).toHaveClass('text-[#2f61c9]');
        expect(screen.getByRole('button', { name: 'Module' })).not.toHaveClass('text-[#2f61c9]');
    });

    it('calls onSelectQuestion when row is clicked', () => {
        const { onSelectQuestion } = renderTable();

        fireEvent.click(getRows()[1]);

        expect(onSelectQuestion).toHaveBeenCalledWith(incorrectQuestion);
    });
});