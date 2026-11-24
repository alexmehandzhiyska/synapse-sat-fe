import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import AnswerChoices from './AnswerChoices';

const choices = [
    { id: 'choice-a', label: 'A', content: 'Choice A' },
    { id: 'choice-b', label: 'B', content: 'Choice B' },
];

const renderChoices = (selectedChoiceId: string | null) => {
    const onSelect = vi.fn();

    render(<AnswerChoices choices={choices} selectedChoiceId={selectedChoiceId} onSelect={onSelect} />);

    return { onSelect };
};

describe('AnswerChoices', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders one button per choice', () => {
        renderChoices(null);

        expect(screen.getAllByRole('button')).toHaveLength(2);
        expect(screen.getByRole('button', { name: /Choice A/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Choice B/ })).toBeInTheDocument();
    });

    it('selects unselected choice on click', () => {
        const { onSelect } = renderChoices(null);

        fireEvent.click(screen.getByRole('button', { name: /Choice B/ }));

        expect(onSelect).toHaveBeenCalledWith('choice-b');
    });

    it('deselects selected choice on click', () => {
        const { onSelect } = renderChoices('choice-a');

        fireEvent.click(screen.getByRole('button', { name: /Choice A/ }));

        expect(onSelect).toHaveBeenCalledWith(null);
    });

    it('switches selection to another choice', () => {
        const { onSelect } = renderChoices('choice-a');

        fireEvent.click(screen.getByRole('button', { name: /Choice B/ }));

        expect(onSelect).toHaveBeenCalledWith('choice-b');
    });

    it('highlights only selected choice', () => {
        renderChoices('choice-a');

        expect(screen.getByRole('button', { name: /Choice A/ })).toHaveClass('bg-blue-50');
        expect(screen.getByRole('button', { name: /Choice B/ })).not.toHaveClass('bg-blue-50');
    });
});