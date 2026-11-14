import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import notebookService from '../../../services/notebookService';
import type { QuestionResult } from '../../../types/score';
import QuestionReviewModal from './QuestionReviewModal';

vi.mock('../../../services/notebookService', () => ({
    default: { create: vi.fn() },
}));

const incorrectQuestion: QuestionResult = {
    id: 'question-1',
    position: 3,
    status: 'incorrect',
    domain: 'algebra',
    difficulty: 'easy',
    passage: 'Passage',
    prompt: 'Prompt',
    selectedChoiceId: 'choice-a',
    answerChoices: [
        { id: 'choice-a', label: 'A', content: 'choice-a', isCorrect: false },
        { id: 'choice-b', label: 'B', content: 'choice-b', isCorrect: true },
    ],
};

const renderModal = (question = incorrectQuestion) => {
    const onClose = vi.fn();

    const { container } = render(<QuestionReviewModal question={question} onClose={onClose} />);

    return { onClose, backdrop: container.firstChild as HTMLElement };
};

const getChoice = (content: string) => screen.getByText(content).parentElement as HTMLElement;
const openNotebookForm = () => {
    fireEvent.click(screen.getByRole('button', { name: "Add to Kolb's Notebook" }));
};

const fillNotebookForm = () => {
    fireEvent.change(screen.getByRole('textbox', { name: 'What?' }), { target: { value: 'What' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'Why?' }), { target: { value: 'Why' } });
    fireEvent.change(screen.getByRole('textbox', { name: 'How?' }), { target: { value: 'How' } });
};

const save = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Save to notebook' }));
};

describe('QuestionReviewModal', () => {
    beforeEach(() => {
        vi.mocked(notebookService.create).mockReset().mockResolvedValue({} as never);
    });

    afterEach(() => {
        cleanup();
    });

    it('renders position, domain and status', () => {
        renderModal();

        expect(screen.getByText('Q3')).toBeInTheDocument();
        expect(screen.getByText('Algebra')).toBeInTheDocument();
        expect(screen.getByText('Incorrect')).toBeInTheDocument();
    });

    it('renders passage and prompt', () => {
        renderModal();

        expect(screen.getByText('Passage')).toBeInTheDocument();
        expect(screen.getByText('Prompt')).toBeInTheDocument();
    });

    it('hides passage when question has none', () => {
        renderModal({ ...incorrectQuestion, passage: null });

        expect(screen.queryByText('Passage')).not.toBeInTheDocument();
    });

    it('highlights correct choice', () => {
        renderModal();

        expect(getChoice('choice-b')).toHaveClass('bg-emerald-50');
    });

    it('marks wrong selected choice as your answer', () => {
        renderModal();

        expect(getChoice('choice-a')).toHaveClass('bg-red-50');
        expect(getChoice('choice-a')).toHaveTextContent('Your answer');
    });

    it('does not mark correct selected choice as your answer', () => {
        renderModal({ ...incorrectQuestion, status: 'correct', selectedChoiceId: 'choice-b' });

        expect(screen.queryByText('Your answer')).not.toBeInTheDocument();
    });

    it('calls onClose when close is clicked', () => {
        const { onClose } = renderModal();

        fireEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
        const { onClose, backdrop } = renderModal();

        fireEvent.click(backdrop);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close when clicking inside modal', () => {
        const { onClose } = renderModal();

        fireEvent.click(screen.getByText('Prompt'));

        expect(onClose).not.toHaveBeenCalled();
    });

    it('opens notebook form', () => {
        renderModal();

        openNotebookForm();

        expect(screen.getByRole('textbox', { name: 'What?' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: "Add to Kolb's Notebook" })).not.toBeInTheDocument();
    });

    it('closes notebook form on cancel', () => {
        renderModal();

        openNotebookForm();
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(screen.queryByRole('textbox', { name: 'What?' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: "Add to Kolb's Notebook" })).toBeInTheDocument();
    });

    it('disables save until all fields are filled', () => {
        renderModal();

        openNotebookForm();

        expect(screen.getByRole('button', { name: 'Save to notebook' })).toBeDisabled();

        fillNotebookForm();

        expect(screen.getByRole('button', { name: 'Save to notebook' })).toBeEnabled();
    });

    it('creates notebook entry for question', async () => {
        renderModal();

        openNotebookForm();
        fillNotebookForm();
        save();

        expect(await screen.findByText("Added to your Kolb's Notebook.")).toBeInTheDocument();
        expect(notebookService.create).toHaveBeenCalledWith({ questionId: 'question-1', what: 'What', why: 'Why', how: 'How' });
        expect(screen.queryByRole('textbox', { name: 'What?' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: "Add to Kolb's Notebook" })).not.toBeInTheDocument();
    });

    it('shows saving state while submitting', () => {
        vi.mocked(notebookService.create).mockReturnValue(new Promise(() => {}));
        renderModal();

        openNotebookForm();
        fillNotebookForm();
        save();

        expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    });

    it('shows error message when saving fails', async () => {
        vi.mocked(notebookService.create).mockRejectedValue(new Error('Entry already exists'));
        renderModal();

        openNotebookForm();
        fillNotebookForm();
        save();

        expect(await screen.findByText('Entry already exists')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save to notebook' })).toBeEnabled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(notebookService.create).mockRejectedValue('error');
        renderModal();

        openNotebookForm();
        fillNotebookForm();
        save();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });
});