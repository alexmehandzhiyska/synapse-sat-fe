import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import lessonsService from '../../../services/lessonsService';
import type { Lesson } from '../../../types/lesson';
import EditLessonForm from './EditLessonForm';

vi.mock('../../../services/lessonsService', () => ({
    default: { updateLesson: vi.fn() },
}));

const lesson: Lesson = {
    id: 'lesson-1',
    domain: 'algebra',
    title: 'Lesson 1',
    videoUrl: 'https://www.youtube.com/watch?v=video-1',
};

const renderForm = () => {
    const onSaved = vi.fn();
    const onCancel = vi.fn();

    render(<EditLessonForm lesson={lesson} onSaved={onSaved} onCancel={onCancel} />);

    return { onSaved, onCancel };
};

const getTitleInput = () => screen.getByPlaceholderText('Lesson title');
const getVideoUrlInput = () => screen.getByPlaceholderText('Video URL');

const submit = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));
};

describe('EditLessonForm', () => {
    beforeEach(() => {
        vi.mocked(lessonsService.updateLesson).mockReset().mockResolvedValue(lesson);
    });

    afterEach(() => {
        cleanup();
    });

    it('prefills form with lesson data', () => {
        renderForm();

        expect(getTitleInput()).toHaveValue('Lesson 1');
        expect(getVideoUrlInput()).toHaveValue('https://www.youtube.com/watch?v=video-1');
    });

    it('shows required errors for cleared fields', async () => {
        renderForm();

        fireEvent.change(getTitleInput(), { target: { value: '' } });
        fireEvent.change(getVideoUrlInput(), { target: { value: '' } });
        submit();

        expect(await screen.findAllByText('Required')).toHaveLength(2);
        expect(lessonsService.updateLesson).not.toHaveBeenCalled();
    });

    it('updates lesson with edited values', async () => {
        renderForm();

        fireEvent.change(getTitleInput(), { target: { value: 'Lesson 2' } });
        submit();

        await waitFor(() => {
            expect(lessonsService.updateLesson).toHaveBeenCalledWith('lesson-1', {
                title: 'Lesson 2',
                videoUrl: 'https://www.youtube.com/watch?v=video-1',
            });
        });
    });

    it('calls onSaved after updating', async () => {
        const { onSaved } = renderForm();

        submit();

        await waitFor(() => {
            expect(onSaved).toHaveBeenCalledTimes(1);
        });
    });

    it('shows saving state while submitting', async () => {
        vi.mocked(lessonsService.updateLesson).mockReturnValue(new Promise(() => {}));
        renderForm();

        submit();

        expect(await screen.findByRole('button', { name: 'Saving...' })).toBeDisabled();
    });

    it('shows error message when updating fails', async () => {
        vi.mocked(lessonsService.updateLesson).mockRejectedValue(new Error('Lesson not found'));
        const { onSaved } = renderForm();

        submit();

        expect(await screen.findByText('Lesson not found')).toBeInTheDocument();
        expect(onSaved).not.toHaveBeenCalled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(lessonsService.updateLesson).mockRejectedValue('error');
        renderForm();

        submit();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });

    it('calls onCancel when cancel is clicked', () => {
        const { onCancel } = renderForm();

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(lessonsService.updateLesson).not.toHaveBeenCalled();
    });
});