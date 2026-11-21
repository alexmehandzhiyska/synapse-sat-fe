import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import authService from '../../services/authService';
import studyPlanService from '../../services/studyPlanService';
import testAttemptService from '../../services/testAttemptService';
import userService from '../../services/userService';
import type { AuthUser, UserProfile } from '../../types/auth';
import type { StudyPlanData } from '../../types/studyPlan';
import type { TestResult } from '../../types/testAttempt';

import Profile from './Profile';

const navigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => ({
    ...(await importOriginal<typeof import('react-router-dom')>()),
    useNavigate: () => navigate,
}));

vi.mock('../../services/authService', () => ({
    default: { getCurrentUser: vi.fn() },
}));

vi.mock('../../services/userService', () => ({
    default: { getProfile: vi.fn() },
}));

vi.mock('../../services/testAttemptService', () => ({
    default: { getAllCompleted: vi.fn() },
}));

vi.mock('../../services/studyPlanService', () => ({
    default: { getOne: vi.fn() },
}));

vi.mock('./EditProfileForm/EditProfileForm', () => ({
    default: ({ profile, onSuccess, onCancel }: { profile: UserProfile; onSuccess: (profile: UserProfile) => void; onCancel: () => void }) => (
        <div>
            <p>Editing {profile.firstName}</p>
            <button onClick={() => onSuccess({ ...profile, firstName: 'Mincho' })}>Save profile</button>
            <button onClick={onCancel}>Cancel editing</button>
        </div>
    ),
}));

vi.mock('./ScoreTrendChart/ScoreTrendChart', () => ({
    default: ({ testResults }: { testResults: TestResult[] }) => <p>Score trend for {testResults.length} results</p>,
}));

vi.mock('./SectionPerformanceChart/SectionPerformanceChart', () => ({
    default: ({ testResults }: { testResults: TestResult[] }) => <p>Section performance for {testResults.length} results</p>,
}));

vi.mock('../StudyPlans/StudyPlanOverview/StudyPlanOverview', () => ({
    default: ({ studyPlan, bestScore }: { studyPlan: StudyPlanData | null; bestScore: number }) => (
        <p>Study plan {studyPlan?.goalScore} with best score {bestScore}</p>
    ),
}));

const profile: UserProfile = {
    id: 'user-1',
    firstName: 'Pencho',
    lastName: 'Dimitrov',
    email: 'pencho@test.com',
    country: 'Country',
    city: 'City',
    school: 'School',
    role: 'student',
};

const studyPlan: StudyPlanData = {
    goalScore: 1400,
    testDate: '2027-03-13',
    prepStartDate: '2027-02-01',
};

const createResult = (id: string, totalScaled: number): TestResult => ({
    id,
    testId: `test-${id}`,
    testTitle: `Test ${id}`,
    completedAt: '2027-01-10T12:00:00Z',
    totalScaled,
    sections: [
        { name: 'reading_writing', scaled: 600 },
        { name: 'math', scaled: totalScaled - 600 },
    ],
});

const renderProfile = () => {
    const { container } = render(
        <MemoryRouter>
            <Profile />
        </MemoryRouter>,
    );

    return { container };
};

const renderLoadedProfile = async () => {
    renderProfile();

    await screen.findByRole('button', { name: 'Edit profile' });
};

const getProfileValues = () => screen.queryAllByRole('definition').map((definition) => definition.textContent);
const getStat = (label: string) => screen.getByText(label).nextElementSibling as HTMLElement;
const getResultLink = (title: string) => screen.getByRole('heading', { name: title }).closest('a') as HTMLElement;

describe('Profile', () => {
    beforeEach(() => {
        localStorage.setItem('accessToken', 'access-token');

        navigate.mockReset();
        vi.mocked(authService.getCurrentUser).mockReset().mockReturnValue({ role: 'student' } as AuthUser);
        vi.mocked(userService.getProfile).mockReset().mockResolvedValue(profile);
        vi.mocked(testAttemptService.getAllCompleted).mockReset().mockResolvedValue([
            createResult('3', 1300),
            createResult('2', 1200),
            createResult('1', 1100),
        ]);

        vi.mocked(studyPlanService.getOne).mockReset().mockResolvedValue(studyPlan);
    });

    afterEach(() => {
        cleanup();
        localStorage.clear();
    });

    it('redirects to login when logged out', () => {
        localStorage.clear();

        renderProfile();

        expect(navigate).toHaveBeenCalledWith('/login');
        expect(userService.getProfile).not.toHaveBeenCalled();
    });

    it('shows placeholders while loading', () => {
        vi.mocked(userService.getProfile).mockReturnValue(new Promise(() => {}));
        vi.mocked(testAttemptService.getAllCompleted).mockReturnValue(new Promise(() => {}));
        vi.mocked(studyPlanService.getOne).mockReturnValue(new Promise(() => {}));

        const { container } = renderProfile();

        expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3);
    });

    it('shows error when loading profile fails', async () => {
        vi.mocked(userService.getProfile).mockRejectedValue(new Error('Server error'));

        renderProfile();

        expect(await screen.findByRole('heading', { name: 'We couldn\'t load your profile' })).toBeInTheDocument();
        expect(screen.getByText('Error loading your profile. Try again later')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Edit profile' })).not.toBeInTheDocument();
    });

    it('shows profile details', async () => {
        await renderLoadedProfile();

        expect(getProfileValues()).toEqual(['Pencho', 'Dimitrov', 'pencho@test.com', 'Country', 'City', 'School']);
    });

    it('shows not provided for missing optional details', async () => {
        vi.mocked(userService.getProfile).mockResolvedValue({ ...profile, country: null, city: null, school: null });

        await renderLoadedProfile();

        expect(getProfileValues()).toEqual(['Pencho', 'Dimitrov', 'pencho@test.com', 'Not provided', 'Not provided', 'Not provided']);
    });

    it('opens edit form instead of details', async () => {
        await renderLoadedProfile();

        fireEvent.click(screen.getByRole('button', { name: 'Edit profile' }));

        expect(screen.getByText('Editing Pencho')).toBeInTheDocument();
        expect(getProfileValues()).toEqual([]);
    });

    it('closes edit form on cancel', async () => {
        await renderLoadedProfile();

        fireEvent.click(screen.getByRole('button', { name: 'Edit profile' }));
        fireEvent.click(screen.getByRole('button', { name: 'Cancel editing' }));

        expect(screen.queryByText('Editing Pencho')).not.toBeInTheDocument();
        expect(getProfileValues()[0]).toBe('Pencho');
    });

    it('shows updated profile after saving', async () => {
        await renderLoadedProfile();

        fireEvent.click(screen.getByRole('button', { name: 'Edit profile' }));
        fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));

        expect(screen.queryByText('Editing Pencho')).not.toBeInTheDocument();
        expect(getProfileValues()[0]).toBe('Mincho');
    });

    it('shows study plan overview with best score', async () => {
        await renderLoadedProfile();

        expect(screen.getByText('Study plan 1400 with best score 1300')).toBeInTheDocument();
    });

    it('hides study plan overview when loading it fails', async () => {
        vi.mocked(studyPlanService.getOne).mockRejectedValue(new Error('Server error'));

        await renderLoadedProfile();

        expect(screen.queryByText('Study plan 1400 with best score 1300')).not.toBeInTheDocument();
    });

    it('shows error when loading test results fails', async () => {
        vi.mocked(testAttemptService.getAllCompleted).mockRejectedValue(new Error('Server error'));

        await renderLoadedProfile();

        expect(screen.getByRole('heading', { name: 'We couldn\'t load your test results' })).toBeInTheDocument();
        expect(screen.getByText('Error loading your test results. Try again later')).toBeInTheDocument();
    });

    it('shows empty message without test results', async () => {
        vi.mocked(testAttemptService.getAllCompleted).mockResolvedValue([]);

        await renderLoadedProfile();

        expect(screen.getByText('You haven\'t completed any practice tests yet.')).toBeInTheDocument();
        expect(screen.queryByText('Best score')).not.toBeInTheDocument();
    });

    it('shows score summary', async () => {
        await renderLoadedProfile();

        expect(getStat('Best score')).toHaveTextContent('1300');
        expect(getStat('Latest score')).toHaveTextContent('1300');
        expect(getStat('Average score')).toHaveTextContent('1200');
    });

    it('shows positive trend in green', async () => {
        await renderLoadedProfile();

        expect(getStat('Trend')).toHaveTextContent('+8%');
        expect(getStat('Trend')).toHaveClass('text-emerald-600');
    });

    it('shows negative trend in red', async () => {
        vi.mocked(testAttemptService.getAllCompleted).mockResolvedValue([createResult('2', 1100), createResult('1', 1200)]);

        await renderLoadedProfile();

        expect(getStat('Trend')).toHaveTextContent('-8%');
        expect(getStat('Trend')).toHaveClass('text-red-600');
    });

    it('shows no trend for single test result', async () => {
        vi.mocked(testAttemptService.getAllCompleted).mockResolvedValue([createResult('1', 1200)]);

        await renderLoadedProfile();

        expect(getStat('Trend')).toHaveTextContent('—');
        expect(getStat('Trend')).toHaveClass('text-[#13385A]');
    });

    it('renders charts with test results', async () => {
        await renderLoadedProfile();

        expect(screen.getByText('Score trend for 3 results')).toBeInTheDocument();
        expect(screen.getByText('Section performance for 3 results')).toBeInTheDocument();
    });

    it('links each test result to its score report', async () => {
        await renderLoadedProfile();

        expect(getResultLink('Test 3')).toHaveAttribute('href', '/practice-tests/test-3/results/3');
        expect(getResultLink('Test 2')).toHaveAttribute('href', '/practice-tests/test-2/results/2');
        expect(getResultLink('Test 1')).toHaveAttribute('href', '/practice-tests/test-1/results/1');
    });

    it('shows completion date and scores for test result', async () => {
        await renderLoadedProfile();

        const resultLink = within(getResultLink('Test 3'));

        expect(resultLink.getByText('Completed 1/10/2027')).toBeInTheDocument();
        expect(resultLink.getByText('Reading and Writing').nextElementSibling).toHaveTextContent('600');
        expect(resultLink.getByText('Math').nextElementSibling).toHaveTextContent('700');
        expect(resultLink.getByText('Total').nextElementSibling).toHaveTextContent('1300');
    });

    it('hides study plan and test results for teacher', async () => {
        vi.mocked(authService.getCurrentUser).mockReturnValue({ role: 'teacher' } as AuthUser);

        await renderLoadedProfile();

        expect(screen.queryByRole('heading', { name: 'Test results' })).not.toBeInTheDocument();
        expect(screen.queryByText('Study plan 1400 with best score 1300')).not.toBeInTheDocument();
        expect(testAttemptService.getAllCompleted).not.toHaveBeenCalled();
        expect(studyPlanService.getOne).not.toHaveBeenCalled();
    });
});