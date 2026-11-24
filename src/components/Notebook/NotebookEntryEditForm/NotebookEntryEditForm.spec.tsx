import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import notebookService from '../../../services/notebookService';
import type { NotebookEntry } from '../../../types/notebook';
import NotebookEntryEditForm from './NotebookEntryEditForm';

vi.mock('../../../services/notebookService', () => ({
    default: { update: vi.fn() },
}));

const entry: NotebookEntry = {
    id: 'entry-1',
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
};

const updatedEntry: NotebookEntry = { ...entry, what: 'New what', why: 'New why', how: 'New how' };

const renderForm = () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<NotebookEntryEditForm entry={entry} onSave={onSave} onCancel={onCancel} />);

    return { onSave, onCancel };
};

const getSaveButton = () => screen.getByRole('button', { name: 'Save changes' });

const changeField = (label: string, value: string) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
};

const save = () => {
    fireEvent.click(getSaveButton());
};

describe('NotebookEntryEditForm', () => {
    beforeEach(() => {
        vi.mocked(notebookService.update).mockReset().mockResolvedValue(updatedEntry);
    });

    afterEach(() => {
        cleanup();
    });

    it('prefills fields with entry', () => {
        renderForm();

        expect(screen.getByLabelText('What?')).toHaveValue('What');
        expect(screen.getByLabelText('Why?')).toHaveValue('Why');
        expect(screen.getByLabelText('How?')).toHaveValue('How');
    });

    it('disables save when what is empty', () => {
        renderForm();

        changeField('What?', '');

        expect(getSaveButton()).toBeDisabled();
    });

    it('disables save when why is empty', () => {
        renderForm();

        changeField('Why?', '');

        expect(getSaveButton()).toBeDisabled();
    });

    it('disables save when how is empty', () => {
        renderForm();

        changeField('How?', '');

        expect(getSaveButton()).toBeDisabled();
    });

    it('updates entry with edited fields', async () => {
        renderForm();

        changeField('What?', 'New what');
        changeField('Why?', 'New why');
        changeField('How?', 'New how');
        save();

        await waitFor(() => {
            expect(notebookService.update).toHaveBeenCalledWith('entry-1', { what: 'New what', why: 'New why', how: 'New how' });
        });
    });

    it('calls onSave with updated entry', async () => {
        const { onSave } = renderForm();

        save();

        await waitFor(() => {
            expect(onSave).toHaveBeenCalledWith(updatedEntry);
        });
    });

    it('shows saving state while submitting', () => {
        vi.mocked(notebookService.update).mockReturnValue(new Promise(() => {}));
        renderForm();

        save();

        expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    });

    it('shows error message when saving fails', async () => {
        vi.mocked(notebookService.update).mockRejectedValue(new Error('Could not update entry'));
        const { onSave } = renderForm();

        save();

        expect(await screen.findByText('Could not update entry')).toBeInTheDocument();
        expect(getSaveButton()).toBeEnabled();
        expect(onSave).not.toHaveBeenCalled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(notebookService.update).mockRejectedValue('error');
        renderForm();

        save();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });

    it('calls onCancel on cancel', () => {
        const { onCancel } = renderForm();

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(notebookService.update).not.toHaveBeenCalled();
    });
});