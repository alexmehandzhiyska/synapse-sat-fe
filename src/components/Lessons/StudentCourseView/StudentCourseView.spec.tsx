import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import lessonsService from '../../../services/lessonsService';
import type { DomainProgress, LessonWithProgress } from '../../../types/lesson';
import type { Domain } from '../../../types/practiceTest';
import StudentCourseView from './StudentCourseView';

vi.mock('../../../services/lessonsService', () => ({
    default: { getProgress: vi.fn(), completeLesson: vi.fn() },
}));

const createLesson = (id: string, title: string, isWatched: boolean, domain: Domain = 'algebra'): LessonWithProgress => ({
    id,
    domain,
    title,
    videoUrl: `https://www.youtube.com/watch?v=${id}`,
    isWatched,
});

const completeDomain: DomainProgress = {
    domain: 'information_and_ideas',
    status: 'complete',
    isRecommended: true,
    lessons: [createLesson('lesson-1', 'Lesson 1', true, 'information_and_ideas')],
    checkInTestId: 'test-1',
    isCheckInComplete: true,
};

const currentDomain: DomainProgress = {
    domain: 'algebra',
    status: 'current',
    isRecommended: true,
    lessons: [createLesson('lesson-2', 'Lesson 2', true), createLesson('lesson-3', 'Lesson 3', false)],
    checkInTestId: 'test-2',
    isCheckInComplete: false,
};

const lockedDomain: DomainProgress = {
    domain: 'advanced_math',
    status: 'locked',
    isRecommended: false,
    lessons: [createLesson('lesson-4', 'Lesson 4', false, 'advanced_math')],
    checkInTestId: 'test-3',
    isCheckInComplete: false,
};

const renderView = () => {
    render(
        <MemoryRouter>
            <StudentCourseView />
        </MemoryRouter>,
    );
};

const renderLoadedView = async () => {
    renderView();

    await screen.findByRole('heading', { name: 'Your course' });
};

const getDomainCard = (label: string) => screen.getByRole('heading', { name: label }).closest('.border-2') as HTMLElement;

describe('StudentCourseView', () => {
    beforeEach(() => {
        vi.mocked(lessonsService.getProgress).mockReset().mockResolvedValue([completeDomain, currentDomain, lockedDomain]);
        vi.mocked(lessonsService.completeLesson).mockReset().mockResolvedValue();
    });

    afterEach(() => {
        cleanup();
    });

    it('shows loading message while loading', () => {
        vi.mocked(lessonsService.getProgress).mockReturnValue(new Promise(() => {}));

        renderView();

        expect(screen.getByText('Loading your course...')).toBeInTheDocument();
    });

    it('shows error when loading fails', async () => {
        vi.mocked(lessonsService.getProgress).mockRejectedValue(new Error('Server error'));

        renderView();

        expect(await screen.findByText('Error loading your course. Try again later.')).toBeInTheDocument();
    });

    it('shows empty state without domains', async () => {
        vi.mocked(lessonsService.getProgress).mockResolvedValue([]);

        renderView();

        expect(await screen.findByRole('heading', { name: 'No lessons yet' })).toBeInTheDocument();
    });

    it('renders domains in course order', async () => {
        await renderLoadedView();

        expect(screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
            'Information and Ideas',
            'Algebra',
            'Advanced Math',
        ]);
    });

    it('styles domains by status', async () => {
        await renderLoadedView();

        expect(getDomainCard('Information and Ideas')).toHaveClass('bg-emerald-50');
        expect(getDomainCard('Algebra')).toHaveClass('bg-blue-50');
        expect(getDomainCard('Advanced Math')).toHaveClass('opacity-60');
    });

    it('marks only non-recommended domains as stretch goals', async () => {
        await renderLoadedView();

        expect(within(getDomainCard('Advanced Math')).getByText('Stretch goal — may not fit your timeline')).toBeInTheDocument();
        expect(screen.getAllByText('Stretch goal — may not fit your timeline')).toHaveLength(1);
    });

    it('hides lessons and check-in for locked domain', async () => {
        await renderLoadedView();

        expect(screen.queryByText('Lesson 4 ▸')).not.toBeInTheDocument();
        expect(within(getDomainCard('Advanced Math')).queryByText('Check-in test')).not.toBeInTheDocument();
    });

    it('shows watched label for watched lessons', async () => {
        await renderLoadedView();

        expect(within(getDomainCard('Algebra')).getByText('Watched')).toBeInTheDocument();
    });

    it('shows mark complete for unwatched lessons', async () => {
        await renderLoadedView();

        expect(within(getDomainCard('Algebra')).getAllByRole('button', { name: 'Mark complete' })).toHaveLength(1);
    });

    it('marks lesson complete and reloads progress', async () => {
        await renderLoadedView();
        vi.mocked(lessonsService.getProgress).mockResolvedValue([
            completeDomain,
            { ...currentDomain, lessons: currentDomain.lessons.map((lesson) => ({ ...lesson, isWatched: true })) },
            lockedDomain,
        ]);

        fireEvent.click(screen.getByRole('button', { name: 'Mark complete' }));

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: 'Mark complete' })).not.toBeInTheDocument();
        });

        expect(lessonsService.completeLesson).toHaveBeenCalledWith('lesson-3');
        expect(lessonsService.getProgress).toHaveBeenCalledTimes(2);
    });

    it('does not expand video when marking complete', async () => {
        await renderLoadedView();

        fireEvent.click(screen.getByRole('button', { name: 'Mark complete' }));

        await waitFor(() => {
            expect(lessonsService.getProgress).toHaveBeenCalledTimes(2);
        });

        expect(screen.queryByTitle('Lesson 3')).not.toBeInTheDocument();
    });

    it('links to incomplete check-in test', async () => {
        await renderLoadedView();

        expect(within(getDomainCard('Algebra')).getByRole('link', { name: 'Take check-in test' })).toHaveAttribute('href', '/practice-tests/test-2');
    });

    it('shows completed label for completed check-in test', async () => {
        await renderLoadedView();

        expect(within(getDomainCard('Information and Ideas')).getByText('Completed')).toBeInTheDocument();
        expect(within(getDomainCard('Information and Ideas')).queryByRole('link', { name: 'Take check-in test' })).not.toBeInTheDocument();
    });

    it('hides check-in when domain has none', async () => {
        vi.mocked(lessonsService.getProgress).mockResolvedValue([{ ...currentDomain, checkInTestId: null }]);

        await renderLoadedView();

        expect(screen.queryByText('Check-in test')).not.toBeInTheDocument();
    });
});