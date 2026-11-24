import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import notebookService from '../../services/notebookService';
import type { NotebookEntry } from '../../types/notebook';
import Notebook from './Notebook';

const navigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => ({
    ...(await importOriginal<typeof import('react-router-dom')>()),
    useNavigate: () => navigate,
}));

vi.mock('../../services/notebookService', () => ({
    default: { getAll: vi.fn() },
}));

vi.mock('./NotebookEntryCard/NotebookEntryCard', () => ({
    default: ({ entry, onUpdated, onDeleted }: { entry: NotebookEntry; onUpdated: (entry: NotebookEntry) => void; onDeleted: (entryId: string) => void }) => (
        <div>
            <h2>{entry.id}: {entry.what}</h2>
            <button onClick={() => onUpdated({ ...entry, what: 'New what' })}>Update {entry.id}</button>
            <button onClick={() => onDeleted(entry.id)}>Delete {entry.id}</button>
        </div>
    ),
}));

const createEntry = (id: string): NotebookEntry => ({
    id,
    questionId: 'question-1',
    question: {
        id: 'question-1',
        prompt: 'Prompt',
        passage: null,
        domain: 'algebra',
        answerChoices: [],
    },
    what: 'What',
    why: 'Why',
    how: 'How',
    createdAt: '2027-01-10T12:00:00Z',
    updatedAt: '2027-01-10T12:00:00Z',
});

const renderNotebook = () => {
    const { container } = render(
        <MemoryRouter>
            <Notebook />
        </MemoryRouter>,
    );

    return { container };
};

const renderLoadedNotebook = async () => {
    renderNotebook();

    await screen.findByText('entry-1: What');
};

const getEntries = () => screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);

describe('Notebook', () => {
    beforeEach(() => {
        localStorage.setItem('accessToken', 'access-token');
        navigate.mockReset();
        vi.mocked(notebookService.getAll).mockReset().mockResolvedValue([createEntry('entry-1'), createEntry('entry-2')]);
    });

    afterEach(() => {
        cleanup();
        localStorage.clear();
    });

    it('redirects to login when logged out', () => {
        localStorage.clear();

        renderNotebook();

        expect(navigate).toHaveBeenCalledWith('/login');
        expect(notebookService.getAll).not.toHaveBeenCalled();
    });

    it('shows placeholders while loading', () => {
        vi.mocked(notebookService.getAll).mockReturnValue(new Promise(() => {}));

        const { container } = renderNotebook();

        expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3);
    });

    it('shows error when loading fails', async () => {
        vi.mocked(notebookService.getAll).mockRejectedValue(new Error('Server error'));

        const { container } = renderNotebook();

        expect(await screen.findByRole('heading', { name: 'We couldn\'t load your notebook' })).toBeInTheDocument();
        expect(screen.getByText('Error loading your notebook. Try again later')).toBeInTheDocument();
        expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });

    it('shows empty state without entries', async () => {
        vi.mocked(notebookService.getAll).mockResolvedValue([]);

        renderNotebook();

        expect(await screen.findByRole('heading', { name: 'Your notebook is empty' })).toBeInTheDocument();
    });

    it('renders entries in order', async () => {
        await renderLoadedNotebook();

        expect(getEntries()).toEqual(['entry-1: What', 'entry-2: What']);
    });

    it('replaces entry after update', async () => {
        await renderLoadedNotebook();

        fireEvent.click(screen.getByRole('button', { name: 'Update entry-2' }));

        expect(getEntries()).toEqual(['entry-1: What', 'entry-2: New what']);
    });

    it('removes entry after delete', async () => {
        await renderLoadedNotebook();

        fireEvent.click(screen.getByRole('button', { name: 'Delete entry-1' }));

        expect(getEntries()).toEqual(['entry-2: What']);
    });

    it('shows empty state after deleting last entry', async () => {
        vi.mocked(notebookService.getAll).mockResolvedValue([createEntry('entry-1')]);
        await renderLoadedNotebook();

        fireEvent.click(screen.getByRole('button', { name: 'Delete entry-1' }));

        expect(screen.getByRole('heading', { name: 'Your notebook is empty' })).toBeInTheDocument();
    });
});