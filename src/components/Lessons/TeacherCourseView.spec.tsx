import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import lessonsService from '../../services/lessonsService';
import type { Lesson } from '../../types/lesson';
import type { Domain } from '../../types/practiceTest';
import TeacherCourseView from './TeacherCourseView';

vi.mock('../../services/lessonsService', () => ({
    default: { getAll: vi.fn(), deleteLesson: vi.fn() },
}));

vi.mock('./AddLessonForm/AddLessonForm', () => ({
    default: ({ domain, onCreated }: { domain: Domain; onCreated: () => void }) => (
        <button onClick={onCreated}>Add lesson to {domain}</button>
    ),
}));

vi.mock('./EditLessonForm/EditLessonForm', () => ({
    default: ({ lesson, onSaved, onCancel }: { lesson: Lesson; onSaved: () => void; onCancel: () => void }) => (
        <div>
            <p>Editing {lesson.title}</p>
            <button onClick={onSaved}>Save lesson</button>
            <button onClick={onCancel}>Cancel editing</button>
        </div>
    ),
}));

const createLesson = (id: string, title: string, domain: Domain): Lesson => ({
    id,
    domain,
    title,
    videoUrl: `https://www.youtube.com/watch?v=${id}`,
});

const lessons = [
    createLesson('lesson-1', 'Lesson 1', 'algebra'),
    createLesson('lesson-2', 'Lesson 2', 'algebra'),
    createLesson('lesson-3', 'Lesson 3', 'information_and_ideas'),
];

const renderLoadedView = async () => {
    render(<TeacherCourseView />);

    await screen.findByText('Lesson 1 ▸');
};

const getDomainCard = (label: string) => screen.getByRole('heading', { name: label }).closest('.shadow-sm') as HTMLElement;

const getModal = () => screen.getByRole('heading', { name: 'Delete lesson?' }).parentElement as HTMLElement;

const getLessonRow = (title: string) => screen.getByText(`${title} ▸`).closest('[role="button"]') as HTMLElement;

const clickLessonButton = (title: string, name: string) => {
    fireEvent.click(within(getLessonRow(title)).getByRole('button', { name }));
};

const confirmDelete = () => {
    fireEvent.click(within(getModal()).getByRole('button', { name: 'Delete' }));
};

describe('TeacherCourseView', () => {
    beforeEach(() => {
        vi.mocked(lessonsService.getAll).mockReset().mockResolvedValue(lessons);
        vi.mocked(lessonsService.deleteLesson).mockReset().mockResolvedValue();
    });

    afterEach(() => {
        cleanup();
    });

    it('shows loading message while loading', () => {
        vi.mocked(lessonsService.getAll).mockReturnValue(new Promise(() => {}));

        render(<TeacherCourseView />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows error when loading fails', async () => {
        vi.mocked(lessonsService.getAll).mockRejectedValue(new Error('Server error'));

        render(<TeacherCourseView />);

        expect(await screen.findByText('Error loading lessons. Try again later.')).toBeInTheDocument();
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('renders all domains in order', async () => {
        await renderLoadedView();

        expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
            'Information and Ideas',
            'Craft and Structure',
            'Expression of Ideas',
            'Standard English Conventions',
            'Algebra',
            'Advanced Math',
            'Problem Solving and Data Analysis',
            'Geometry and Trigonometry',
        ]);
    });

    it('groups lessons by domain', async () => {
        await renderLoadedView();

        expect(within(getDomainCard('Information and Ideas')).getByText('Lesson 3 ▸')).toBeInTheDocument();
        expect(within(getDomainCard('Algebra')).getByText('Lesson 1 ▸')).toBeInTheDocument();
        expect(within(getDomainCard('Algebra')).getByText('Lesson 2 ▸')).toBeInTheDocument();
    });

    it('renders add form for each domain', async () => {
        await renderLoadedView();

        expect(within(getDomainCard('Information and Ideas')).getByRole('button', { name: 'Add lesson to information_and_ideas' })).toBeInTheDocument();
        expect(within(getDomainCard('Algebra')).getByRole('button', { name: 'Add lesson to algebra' })).toBeInTheDocument();
        expect(within(getDomainCard('Geometry and Trigonometry')).getByRole('button', { name: 'Add lesson to geometry_and_trigonometry' })).toBeInTheDocument();
    });

    it('reloads lessons after creating lesson', async () => {
        await renderLoadedView();
        vi.mocked(lessonsService.getAll).mockResolvedValue([...lessons, createLesson('lesson-4', 'Lesson 4', 'algebra')]);

        fireEvent.click(screen.getByRole('button', { name: 'Add lesson to algebra' }));

        expect(await within(getDomainCard('Algebra')).findByText('Lesson 4 ▸')).toBeInTheDocument();
    });

    it('opens edit form for lesson', async () => {
        await renderLoadedView();

        clickLessonButton('Lesson 1', 'Edit');

        expect(screen.getByText('Editing Lesson 1')).toBeInTheDocument();
        expect(screen.queryByText('Lesson 1 ▸')).not.toBeInTheDocument();
        expect(screen.getByText('Lesson 2 ▸')).toBeInTheDocument();
    });

    it('does not expand video when clicking edit', async () => {
        await renderLoadedView();

        clickLessonButton('Lesson 1', 'Edit');

        expect(screen.queryByTitle('Lesson 1')).not.toBeInTheDocument();
    });

    it('closes edit form on cancel', async () => {
        await renderLoadedView();
        clickLessonButton('Lesson 1', 'Edit');

        fireEvent.click(screen.getByRole('button', { name: 'Cancel editing' }));

        expect(screen.queryByText('Editing Lesson 1')).not.toBeInTheDocument();
        expect(screen.getByText('Lesson 1 ▸')).toBeInTheDocument();
        expect(lessonsService.getAll).toHaveBeenCalledTimes(1);
    });

    it('closes edit form and reloads lessons after saving', async () => {
        await renderLoadedView();
        clickLessonButton('Lesson 1', 'Edit');
        vi.mocked(lessonsService.getAll).mockResolvedValue([{ ...lessons[0], title: 'Lesson 1 edited' }, lessons[1], lessons[2]]);

        fireEvent.click(screen.getByRole('button', { name: 'Save lesson' }));

        expect(await screen.findByText('Lesson 1 edited ▸')).toBeInTheDocument();
        expect(screen.queryByText('Editing Lesson 1')).not.toBeInTheDocument();
    });

    it('asks to confirm before deleting', async () => {
        await renderLoadedView();

        clickLessonButton('Lesson 1', 'Delete');

        expect(within(getModal()).getByText('Delete "Lesson 1"? This can\'t be undone.')).toBeInTheDocument();
        expect(lessonsService.deleteLesson).not.toHaveBeenCalled();
    });

    it('does not expand video when clicking delete', async () => {
        await renderLoadedView();

        clickLessonButton('Lesson 1', 'Delete');

        expect(screen.queryByTitle('Lesson 1')).not.toBeInTheDocument();
    });

    it('closes confirmation on cancel', async () => {
        await renderLoadedView();
        clickLessonButton('Lesson 1', 'Delete');

        fireEvent.click(within(getModal()).getByRole('button', { name: 'Cancel' }));

        expect(screen.queryByRole('heading', { name: 'Delete lesson?' })).not.toBeInTheDocument();
        expect(lessonsService.deleteLesson).not.toHaveBeenCalled();
    });

    it('deletes lesson after confirming', async () => {
        await renderLoadedView();
        clickLessonButton('Lesson 1', 'Delete');

        confirmDelete();

        await waitFor(() => {
            expect(screen.queryByText('Lesson 1 ▸')).not.toBeInTheDocument();
        });

        expect(lessonsService.deleteLesson).toHaveBeenCalledWith('lesson-1');
        expect(screen.queryByRole('heading', { name: 'Delete lesson?' })).not.toBeInTheDocument();
        expect(screen.getByText('Lesson 2 ▸')).toBeInTheDocument();
    });

    it('shows deleting state while deleting', async () => {
        vi.mocked(lessonsService.deleteLesson).mockReturnValue(new Promise(() => {}));
        await renderLoadedView();
        clickLessonButton('Lesson 1', 'Delete');

        confirmDelete();

        expect(within(getLessonRow('Lesson 1')).getByRole('button', { name: 'Deleting...' })).toBeDisabled();
        expect(within(getLessonRow('Lesson 2')).getByRole('button', { name: 'Delete' })).toBeEnabled();
    });

    it('shows error message when deleting fails', async () => {
        vi.mocked(lessonsService.deleteLesson).mockRejectedValue(new Error('Could not delete lesson'));
        await renderLoadedView();
        clickLessonButton('Lesson 1', 'Delete');

        confirmDelete();

        expect(await screen.findByText('Could not delete lesson')).toBeInTheDocument();
        expect(within(getLessonRow('Lesson 1')).getByRole('button', { name: 'Delete' })).toBeEnabled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(lessonsService.deleteLesson).mockRejectedValue('error');
        await renderLoadedView();
        clickLessonButton('Lesson 1', 'Delete');

        confirmDelete();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });
});