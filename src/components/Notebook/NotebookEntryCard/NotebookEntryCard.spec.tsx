import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import notebookService from '../../../services/notebookService';
import type { NotebookEntry } from '../../../types/notebook';
import NotebookEntryCard from './NotebookEntryCard';

vi.mock('../../../services/notebookService', () => ({
    default: { remove: vi.fn() },
}));

vi.mock('../NotebookEntryEditForm/NotebookEntryEditForm', () => ({
    default: ({ entry, onSave, onCancel }: { entry: NotebookEntry; onSave: (entry: NotebookEntry) => void; onCancel: () => void }) => (
        <div>
            <p>Editing {entry.id}</p>
            <button onClick={() => onSave({ ...entry, what: 'New what' })}>Save entry</button>
            <button onClick={onCancel}>Cancel editing</button>
        </div>
    ),
}));

const entry: NotebookEntry = {
    id: 'entry-1',
    questionId: 'question-1',
    question: {
        id: 'question-1',
        prompt: 'Prompt',
        passage: 'Passage',
        domain: 'algebra',
        answerChoices: [
            { id: 'choice-a', label: 'A', content: 'Choice A', isCorrect: true },
            { id: 'choice-b', label: 'B', content: 'Choice B', isCorrect: false },
        ],
    },
    what: 'What',
    why: 'Why',
    how: 'How',
    createdAt: '2027-01-10T12:00:00Z',
    updatedAt: '2027-01-10T12:00:00Z',
};

const renderCard = (cardEntry = entry) => {
    const onUpdated = vi.fn();
    const onDeleted = vi.fn();

    render(<NotebookEntryCard entry={cardEntry} onUpdated={onUpdated} onDeleted={onDeleted} />);

    return { onUpdated, onDeleted };
};

const expandQuestion = () => {
    fireEvent.click(screen.getByText('Prompt ▸'));
};

const getReflection = () => screen.queryAllByRole('definition').map((definition) => definition.textContent);
const getModal = () => screen.getByRole('heading', { name: 'Remove notebook entry?' }).parentElement as HTMLElement;

const openDeleteConfirm = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
};

const confirmDelete = () => {
    openDeleteConfirm();
    fireEvent.click(within(getModal()).getByRole('button', { name: 'Remove' }));
};

describe('NotebookEntryCard', () => {
    beforeEach(() => {
        vi.mocked(notebookService.remove).mockReset().mockResolvedValue();
    });

    afterEach(() => {
        cleanup();
    });

    it('shows domain and collapsed prompt', () => {
        renderCard();

        expect(screen.getByText('Algebra')).toBeInTheDocument();
        expect(screen.getByText('Prompt ▸')).toBeInTheDocument();
        expect(screen.queryByText('Passage')).not.toBeInTheDocument();
        expect(screen.queryByText('Choice A')).not.toBeInTheDocument();
    });

    it('expands question on click', () => {
        renderCard();

        expandQuestion();

        expect(screen.getByText('Prompt ▾')).toBeInTheDocument();
        expect(screen.getByText('Passage')).toBeInTheDocument();
        expect(screen.getByText('Choice A')).toBeInTheDocument();
        expect(screen.getByText('Choice B')).toBeInTheDocument();
    });

    it('expands question with keyboard', () => {
        renderCard();

        fireEvent.keyDown(screen.getByText('Prompt ▸'), { key: 'Enter' });

        expect(screen.getByText('Prompt ▾')).toBeInTheDocument();
    });

    it('collapses question on second click', () => {
        renderCard();
        expandQuestion();

        fireEvent.click(screen.getByText('Prompt ▾'));

        expect(screen.getByText('Prompt ▸')).toBeInTheDocument();
        expect(screen.queryByText('Passage')).not.toBeInTheDocument();
    });

    it('hides passage when question has none', () => {
        renderCard({ ...entry, question: { ...entry.question, passage: null } });

        expandQuestion();

        expect(screen.queryByText('Passage')).not.toBeInTheDocument();
        expect(screen.getByText('Choice A')).toBeInTheDocument();
    });

    it('highlights only correct choice', () => {
        renderCard();

        expandQuestion();

        expect(screen.getByText('Choice A').parentElement).toHaveClass('bg-emerald-50');
        expect(screen.getByText('Choice B').parentElement).not.toHaveClass('bg-emerald-50');
    });

    it('shows reflection by default', () => {
        renderCard();

        expect(screen.getByRole('button', { name: 'What / Why / How ▾' })).toBeInTheDocument();
        expect(getReflection()).toEqual(['What', 'Why', 'How']);
    });

    it('collapses reflection on click', () => {
        renderCard();

        fireEvent.click(screen.getByRole('button', { name: 'What / Why / How ▾' }));

        expect(screen.getByRole('button', { name: 'What / Why / How ▸' })).toBeInTheDocument();
        expect(getReflection()).toEqual([]);
    });

    it('opens edit form instead of reflection', () => {
        renderCard();

        fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

        expect(screen.getByText('Editing entry-1')).toBeInTheDocument();
        expect(getReflection()).toEqual([]);
        expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    });

    it('closes edit form on cancel', () => {
        const { onUpdated } = renderCard();
        fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

        fireEvent.click(screen.getByRole('button', { name: 'Cancel editing' }));

        expect(screen.queryByText('Editing entry-1')).not.toBeInTheDocument();
        expect(getReflection()).toEqual(['What', 'Why', 'How']);
        expect(onUpdated).not.toHaveBeenCalled();
    });

    it('calls onUpdated and closes edit form after saving', () => {
        const { onUpdated } = renderCard();
        fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

        fireEvent.click(screen.getByRole('button', { name: 'Save entry' }));

        expect(onUpdated).toHaveBeenCalledWith({ ...entry, what: 'New what' });
        expect(screen.queryByText('Editing entry-1')).not.toBeInTheDocument();
    });

    it('asks to confirm before deleting', () => {
        renderCard();

        openDeleteConfirm();

        expect(within(getModal()).getByText('Remove this entry from your Kolb\'s Notebook?')).toBeInTheDocument();
        expect(notebookService.remove).not.toHaveBeenCalled();
    });

    it('closes confirmation on cancel', () => {
        renderCard();
        openDeleteConfirm();

        fireEvent.click(within(getModal()).getByRole('button', { name: 'Cancel' }));

        expect(screen.queryByRole('heading', { name: 'Remove notebook entry?' })).not.toBeInTheDocument();
        expect(notebookService.remove).not.toHaveBeenCalled();
    });

    it('removes entry and calls onDeleted after confirming', async () => {
        const { onDeleted } = renderCard();

        confirmDelete();

        await waitFor(() => {
            expect(onDeleted).toHaveBeenCalledWith('entry-1');
        });

        expect(notebookService.remove).toHaveBeenCalledWith('entry-1');
        expect(screen.queryByRole('heading', { name: 'Remove notebook entry?' })).not.toBeInTheDocument();
    });

    it('shows deleting state while deleting', () => {
        vi.mocked(notebookService.remove).mockReturnValue(new Promise(() => {}));
        renderCard();

        confirmDelete();

        expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled();
    });

    it('shows error message when deleting fails', async () => {
        vi.mocked(notebookService.remove).mockRejectedValue(new Error('Could not remove entry'));
        const { onDeleted } = renderCard();

        confirmDelete();

        expect(await screen.findByText('Could not remove entry')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeEnabled();
        expect(onDeleted).not.toHaveBeenCalled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(notebookService.remove).mockRejectedValue('error');
        renderCard();

        confirmDelete();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });
});