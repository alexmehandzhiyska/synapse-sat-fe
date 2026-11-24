import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import QuestionNavigator, { type QuestionStatus } from './QuestionNavigator';

const statuses: QuestionStatus[] = ['answered', 'skipped', 'current', 'unreached'];

const renderNavigator = (moduleLabel = 'Module 1') => {
    const onSelect = vi.fn();
    const onClose = vi.fn();

    render(
        <QuestionNavigator
            sectionLabel="Math"
            moduleLabel={moduleLabel}
            statuses={statuses}
            onSelect={onSelect}
            onClose={onClose}
        />,
    );

    return { onSelect, onClose };
};

describe('QuestionNavigator', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders section and module label', () => {
        renderNavigator();

        expect(screen.getByText('Math · Module 1')).toBeInTheDocument();
    });

    it('renders only section label without module', () => {
        renderNavigator('');

        expect(screen.getByText('Math')).toBeInTheDocument();
    });

    it('renders one button per question', () => {
        renderNavigator();

        expect(screen.getAllByRole('button', { name: /Go to question/ })).toHaveLength(4);
    });

    it('calls onSelect with clicked question index', () => {
        const { onSelect } = renderNavigator();

        fireEvent.click(screen.getByRole('button', { name: 'Go to question 4' }));

        expect(onSelect).toHaveBeenCalledWith(3);
    });

    it('marks current question', () => {
        renderNavigator();

        expect(screen.getByRole('button', { name: 'Go to question 3' })).toHaveAttribute('aria-current', 'true');
        expect(screen.getByRole('button', { name: 'Go to question 1' })).toHaveAttribute('aria-current', 'false');
    });

    it('styles questions by status', () => {
        renderNavigator();

        expect(screen.getByRole('button', { name: 'Go to question 1' })).toHaveClass('bg-[#2f61c9]');
        expect(screen.getByRole('button', { name: 'Go to question 2' })).toHaveClass('border-dashed');
        expect(screen.getByRole('button', { name: 'Go to question 3' })).toHaveClass('ring-2');
        expect(screen.getByRole('button', { name: 'Go to question 4' })).toHaveClass('border-slate-200');
    });

    it('calls onClose when close is clicked', () => {
        const { onClose } = renderNavigator();

        fireEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
        const { onClose } = renderNavigator();

        fireEvent.click(screen.getByRole('button', { name: 'Close question navigator' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});