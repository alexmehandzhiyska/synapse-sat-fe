import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import TestFooter from './TestFooter';

const questions = [
    { id: 'question-1', isAnswered: true },
    { id: 'question-2', isAnswered: false },
    { id: 'question-3', isAnswered: false },
];

const renderFooter = (currentIndex: number, isSubmitting = false) => {
    const onNavigate = vi.fn();
    const onSubmit = vi.fn();

    render(
        <TestFooter
            questions={questions}
            currentIndex={currentIndex}
            isSubmitting={isSubmitting}
            onNavigate={onNavigate}
            onSubmit={onSubmit}
        />,
    );

    return { onNavigate, onSubmit };
};

describe('TestFooter', () => {
    afterEach(() => {
        cleanup();
    });

    it('disables back on first question', () => {
        renderFooter(0);

        expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
    });

    it('navigates to previous question on back', () => {
        const { onNavigate } = renderFooter(1);

        fireEvent.click(screen.getByRole('button', { name: 'Back' }));

        expect(onNavigate).toHaveBeenCalledWith(0);
    });

    it('navigates to next question on next', () => {
        const { onNavigate } = renderFooter(1);

        fireEvent.click(screen.getByRole('button', { name: 'Next' }));

        expect(onNavigate).toHaveBeenCalledWith(2);
    });

    it('navigates to clicked question', () => {
        const { onNavigate } = renderFooter(0);

        fireEvent.click(screen.getByRole('button', { name: 'Go to question 3' }));

        expect(onNavigate).toHaveBeenCalledWith(2);
    });

    it('marks current question', () => {
        renderFooter(1);

        expect(screen.getByRole('button', { name: 'Go to question 2' })).toHaveAttribute('aria-current', 'true');
        expect(screen.getByRole('button', { name: 'Go to question 1' })).toHaveAttribute('aria-current', 'false');
    });

    it('highlights answered questions', () => {
        renderFooter(2);

        expect(screen.getByRole('button', { name: 'Go to question 1' })).toHaveClass('bg-emerald-50');
        expect(screen.getByRole('button', { name: 'Go to question 2' })).not.toHaveClass('bg-emerald-50');
    });

    it('shows finish instead of next on last question', () => {
        renderFooter(2);

        expect(screen.getByRole('button', { name: 'Finish' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    });

    it('calls onSubmit when finish is clicked', () => {
        const { onSubmit } = renderFooter(2);

        fireEvent.click(screen.getByRole('button', { name: 'Finish' }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('disables finish while submitting', () => {
        renderFooter(2, true);

        expect(screen.getByRole('button', { name: 'Submitting…' })).toBeDisabled();
    });
});