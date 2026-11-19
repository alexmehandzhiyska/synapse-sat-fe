import { act, cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import lessonsService from '../../../services/lessonsService';
import type { DomainProgress, LessonProgressStatus, LessonWithProgress } from '../../../types/lesson';
import type { Domain } from '../../../types/practiceTest';
import type { StudyPlanData } from '../../../types/studyPlan';
import StudyPlanOverview from './StudyPlanOverview';

vi.mock('../../../services/lessonsService', () => ({
    default: { getProgress: vi.fn() },
}));

const studyPlan: StudyPlanData = {
    goalScore: 1400,
    testDate: '2027-01-20',
    prepStartDate: '2027-01-05',
};

const createDomainProgress = (domain: Domain, status: LessonProgressStatus, lessonCount = 2): DomainProgress => ({
    domain,
    status,
    isRecommended: false,
    lessons: Array.from({ length: lessonCount }, () => ({}) as LessonWithProgress),
    checkInTestId: null,
    isCheckInComplete: false,
});

const renderOverview = async (plan: StudyPlanData | null = studyPlan, bestScore = 1200) => {
    const { container } = render(
        <MemoryRouter>
            <StudyPlanOverview studyPlan={plan} bestScore={bestScore} />
        </MemoryRouter>,
    );

    await act(async () => {});

    return { progressBar: container.querySelector('[style]') as HTMLElement };
};

describe('StudyPlanOverview', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date(2027, 0, 10, 12));
        vi.mocked(lessonsService.getProgress).mockReset().mockResolvedValue([]);
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    it('prompts to set up study plan without one', async () => {
        await renderOverview(null);

        expect(screen.getByRole('heading', { name: 'Set up your study plan' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '/study-plan-setup');
    });

    it('does not load progress without study plan', async () => {
        await renderOverview(null);

        expect(lessonsService.getProgress).not.toHaveBeenCalled();
    });

    it('renders study plan with update link', async () => {
        await renderOverview();

        expect(screen.getByRole('heading', { name: 'Study plan' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Update' })).toHaveAttribute('href', '/study-plan-edit');
    });

    it('shows days until test', async () => {
        await renderOverview();

        expect(screen.getByText('10 days')).toBeInTheDocument();
    });

    it('shows singular day until test', async () => {
        await renderOverview({ ...studyPlan, testDate: '2027-01-11' });

        expect(screen.getByText('1 day')).toBeInTheDocument();
    });

    it('shows today on test day', async () => {
        await renderOverview({ ...studyPlan, testDate: '2027-01-10' });

        expect(screen.getByText('Today')).toBeInTheDocument();
    });

    it('shows passed after test day', async () => {
        await renderOverview({ ...studyPlan, testDate: '2027-01-09' });

        expect(screen.getByText('Passed')).toBeInTheDocument();
    });

    it('shows days into prep', async () => {
        await renderOverview();

        expect(screen.getByText('Day 5')).toBeInTheDocument();
    });

    it('shows day 0 on prep start day', async () => {
        await renderOverview({ ...studyPlan, prepStartDate: '2027-01-10' });

        expect(screen.getByText('Day 0')).toBeInTheDocument();
    });

    it('shows days until prep starts', async () => {
        await renderOverview({ ...studyPlan, prepStartDate: '2027-01-13' });

        expect(screen.getByText('Starts in 3 days')).toBeInTheDocument();
    });

    it('shows singular day until prep starts', async () => {
        await renderOverview({ ...studyPlan, prepStartDate: '2027-01-11' });

        expect(screen.getByText('Starts in 1 day')).toBeInTheDocument();
    });

    it('shows best score against goal', async () => {
        const { progressBar } = await renderOverview();

        expect(screen.getByText('1200 / 1400')).toBeInTheDocument();
        expect(progressBar).toHaveStyle({ width: '86%' });
        expect(screen.queryByText("You've hit your goal score. Nice work.")).not.toBeInTheDocument();
    });

    it('shows dash without best score', async () => {
        const { progressBar } = await renderOverview(studyPlan, 0);

        expect(screen.getByText('— / 1400')).toBeInTheDocument();
        expect(progressBar).toHaveStyle({ width: '0%' });
    });

    it('caps progress and congratulates when goal is reached', async () => {
        const { progressBar } = await renderOverview(studyPlan, 1500);

        expect(progressBar).toHaveStyle({ width: '100%' });
        expect(screen.getByText("You've hit your goal score. Nice work.")).toBeInTheDocument();
    });

    it('shows first three incomplete domains up next', async () => {
        vi.mocked(lessonsService.getProgress).mockResolvedValue([
            createDomainProgress('information_and_ideas', 'complete'),
            createDomainProgress('craft_and_structure', 'current'),
            createDomainProgress('expression_of_ideas', 'locked'),
            createDomainProgress('standard_english_conventions', 'locked'),
            createDomainProgress('algebra', 'locked'),
        ]);

        await renderOverview();

        expect(screen.getAllByRole('listitem').map((item) => item.firstChild?.textContent)).toEqual([
            'Craft and Structure',
            'Expression of Ideas',
            'Standard English Conventions',
        ]);
        expect(screen.getByRole('link', { name: 'View course' })).toHaveAttribute('href', '/lessons');
    });

    it('shows lesson count per domain', async () => {
        vi.mocked(lessonsService.getProgress).mockResolvedValue([
            createDomainProgress('algebra', 'current', 1),
            createDomainProgress('advanced_math', 'locked', 3),
        ]);

        await renderOverview();

        expect(screen.getByText('1 lesson')).toBeInTheDocument();
        expect(screen.getByText('3 lessons')).toBeInTheDocument();
    });

    it('hides up next when all domains are complete', async () => {
        vi.mocked(lessonsService.getProgress).mockResolvedValue([createDomainProgress('algebra', 'complete')]);

        await renderOverview();

        expect(screen.queryByText('Up next')).not.toBeInTheDocument();
    });
});