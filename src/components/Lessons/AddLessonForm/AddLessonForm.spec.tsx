import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import lessonsService from '../../../services/lessonsService';
import type { Lesson } from '../../../types/lesson';
import AddLessonForm from './AddLessonForm';

vi.mock('../../../services/lessonsService', () => ({
    default: { createLesson: vi.fn() },
}));

const renderForm = () => {
    const onCreated = vi.fn();

    render(<AddLessonForm domain="algebra" onCreated={onCreated} />);

    return { onCreated };
};

const getTitleInput = () => screen.getByPlaceholderText('Lesson title');
const getVideoUrlInput = () => screen.getByPlaceholderText('Video URL');

const fillForm = () => {
    fireEvent.change(getTitleInput(), { target: { value: 'Lesson 1' } });
    fireEvent.change(getVideoUrlInput(), { target: { value: 'https://www.youtube.com/watch?v=video-1' } });
};

const submit = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Add lesson' }));
};

describe('AddLessonForm', () => {
    beforeEach(() => {
        vi.mocked(lessonsService.createLesson).mockReset().mockResolvedValue({} as Lesson);
    });

    afterEach(() => {
        cleanup();
    });

    it('shows required errors for empty fields', async () => {
        renderForm();

        submit();

        expect(await screen.findAllByText('Required')).toHaveLength(2);
        expect(lessonsService.createLesson).not.toHaveBeenCalled();
    });

    it('creates lesson in domain', async () => {
        renderForm();

        fillForm();
        submit();

        await waitFor(() => {
            expect(lessonsService.createLesson).toHaveBeenCalledWith('algebra', {
                title: 'Lesson 1',
                videoUrl: 'https://www.youtube.com/watch?v=video-1',
            });
        });
    });

    it('calls onCreated and resets form after creating', async () => {
        const { onCreated } = renderForm();

        fillForm();
        submit();

        await waitFor(() => {
            expect(onCreated).toHaveBeenCalledTimes(1);
        });
        
        expect(getTitleInput()).toHaveValue('');
        expect(getVideoUrlInput()).toHaveValue('');
    });

    it('shows adding state while submitting', async () => {
        vi.mocked(lessonsService.createLesson).mockReturnValue(new Promise(() => {}));
        renderForm();

        fillForm();
        submit();

        expect(await screen.findByRole('button', { name: 'Adding...' })).toBeDisabled();
    });

    it('shows error message when creating fails', async () => {
        vi.mocked(lessonsService.createLesson).mockRejectedValue(new Error('Lesson already exists'));
        const { onCreated } = renderForm();

        fillForm();
        submit();

        expect(await screen.findByText('Lesson already exists')).toBeInTheDocument();
        expect(onCreated).not.toHaveBeenCalled();
        expect(getTitleInput()).toHaveValue('Lesson 1');
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(lessonsService.createLesson).mockRejectedValue('error');
        renderForm();

        fillForm();
        submit();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });
});