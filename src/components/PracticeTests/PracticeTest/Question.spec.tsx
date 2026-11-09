import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { SectionName } from '../../../types/practiceTest';
import Question from './Question';

const question = {
    id: 'question-1',
    position: 1,
    domain: 'information_and_ideas',
    difficulty: 'easy',
    passage: 'A passage',
    prompt: 'A prompt',
    answerChoices: [{ id: 'choice-a', label: 'A', content: 'Choice A' }],
};

const renderQuestion = (sectionName: SectionName) => {
    const onSelect = vi.fn();

    render(<Question question={question} sectionName={sectionName} selectedChoiceId={null} onSelect={onSelect} />);

    return { onSelect };
};

describe('Question', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders prompt and answer choices', () => {
        renderQuestion('math');

        expect(screen.getByText('A prompt')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Choice A/ })).toBeInTheDocument();
    });

    it('renders passage for reading and writing', () => {
        renderQuestion('reading_writing');

        expect(screen.getByText('A passage')).toBeInTheDocument();
    });

    it('hides passage for math', () => {
        renderQuestion('math');

        expect(screen.queryByText('A passage')).not.toBeInTheDocument();
    });

    it('passes selection to onSelect', () => {
        const { onSelect } = renderQuestion('math');

        fireEvent.click(screen.getByRole('button', { name: /Choice A/ }));

        expect(onSelect).toHaveBeenCalledWith('choice-a');
    });
});