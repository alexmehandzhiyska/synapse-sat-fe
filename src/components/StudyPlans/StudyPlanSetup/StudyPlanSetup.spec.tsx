import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import studyPlanService from '../../../services/studyPlanService';
import StudyPlanSetup from './StudyPlanSetup';

const navigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => ({
    ...(await importOriginal<typeof import('react-router-dom')>()),
    useNavigate: () => navigate,
}));

vi.mock('../../../services/studyPlanService', () => ({
    default: { upsert: vi.fn() },
}));

vi.mock('./StepProgressBar/StepProgressBar', () => ({
    default: ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
        <p>Step {currentStep} of {totalSteps}</p>
    ),
}));

vi.mock('./GoalScoreStep/GoalScoreStep', () => ({
    default: ({ value, onChange, onNext }: { value: number | null; onChange: (value: number) => void; onNext: () => void }) => (
        <div>
            <p>Goal score: {value ?? 'none'}</p>
            <button onClick={() => onChange(1400)}>Set goal score</button>
            <button onClick={onNext}>Goal score next</button>
        </div>
    ),
}));

vi.mock('./TestDateStep/TestDateStep', () => ({
    default: ({ value, onChange, onNext, onBack }: { value: string; onChange: (value: string) => void; onNext: () => void; onBack: () => void }) => (
        <div>
            <p>Test date: {value || 'none'}</p>
            <button onClick={() => onChange('2027-03-13')}>Set test date</button>
            <button onClick={onNext}>Test date next</button>
            <button onClick={onBack}>Test date back</button>
        </div>
    ),
}));

vi.mock('./PrepStartDateStep/PrepStartDateStep', () => ({
    default: ({
        value,
        testDate,
        onChange,
        onFinish,
        onBack,
        isSubmitting,
        submitError,
    }: {
        value: string;
        testDate: string;
        onChange: (value: string) => void;
        onFinish: () => void;
        onBack: () => void;
        isSubmitting: boolean;
        submitError: string;
    }) => (
        <div>
            <p>Prep start date: {value || 'none'} before {testDate}</p>
            {isSubmitting && <p>Submitting</p>}
            {submitError && <p>{submitError}</p>}
            <button onClick={() => onChange('2027-02-01')}>Set prep start date</button>
            <button onClick={onFinish}>Finish</button>
            <button onClick={onBack}>Prep start date back</button>
        </div>
    ),
}));

const renderSetup = () => {
    render(
        <MemoryRouter>
            <StudyPlanSetup />
        </MemoryRouter>,
    );
};

const click = (name: string) => {
    fireEvent.click(screen.getByRole('button', { name }));
};

const goToPrepStartDateStep = () => {
    click('Set goal score');
    click('Goal score next');
    click('Set test date');
    click('Test date next');
};

const finish = () => {
    goToPrepStartDateStep();
    click('Set prep start date');
    click('Finish');
};

describe('StudyPlanSetup', () => {
    beforeEach(() => {
        localStorage.setItem('accessToken', 'access-token');
        navigate.mockReset();
        vi.mocked(studyPlanService.upsert).mockReset().mockResolvedValue({ goalScore: 1400, testDate: '2027-03-13', prepStartDate: '2027-02-01' });
    });

    afterEach(() => {
        cleanup();
        localStorage.clear();
    });

    it('redirects to login when logged out', () => {
        localStorage.clear();

        renderSetup();

        expect(navigate).toHaveBeenCalledWith('/login');
    });

    it('does not redirect when logged in', () => {
        renderSetup();

        expect(navigate).not.toHaveBeenCalled();
    });

    it('starts on goal score step', () => {
        renderSetup();

        expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
        expect(screen.getByText('Goal score: none')).toBeInTheDocument();
    });

    it('moves to test date step after goal score', () => {
        renderSetup();

        click('Set goal score');
        click('Goal score next');

        expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
        expect(screen.getByText('Test date: none')).toBeInTheDocument();
    });

    it('keeps goal score when going back from test date step', () => {
        renderSetup();

        click('Set goal score');
        click('Goal score next');
        click('Test date back');

        expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
        expect(screen.getByText('Goal score: 1400')).toBeInTheDocument();
    });

    it('moves to prep start date step with test date', () => {
        renderSetup();

        goToPrepStartDateStep();

        expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
        expect(screen.getByText('Prep start date: none before 2027-03-13')).toBeInTheDocument();
    });

    it('keeps test date when going back from prep start date step', () => {
        renderSetup();

        goToPrepStartDateStep();
        click('Prep start date back');

        expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
        expect(screen.getByText('Test date: 2027-03-13')).toBeInTheDocument();
    });

    it('saves study plan with all answers', async () => {
        renderSetup();

        finish();

        await waitFor(() => {
            expect(studyPlanService.upsert).toHaveBeenCalledWith({ goalScore: 1400, testDate: '2027-03-13', prepStartDate: '2027-02-01' });
        });
    });

    it('navigates to lessons after saving', async () => {
        renderSetup();

        finish();

        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/lessons');
        });
    });

    it('shows submitting state while saving', () => {
        vi.mocked(studyPlanService.upsert).mockReturnValue(new Promise(() => {}));
        renderSetup();

        finish();

        expect(screen.getByText('Submitting')).toBeInTheDocument();
    });

    it('shows error when saving fails', async () => {
        vi.mocked(studyPlanService.upsert).mockRejectedValue(new Error('Could not save study plan'));
        renderSetup();

        finish();

        expect(await screen.findByText('Could not save study plan')).toBeInTheDocument();
        expect(screen.queryByText('Submitting')).not.toBeInTheDocument();
        expect(navigate).not.toHaveBeenCalled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(studyPlanService.upsert).mockRejectedValue('error');
        renderSetup();

        finish();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });

    it('does not save without goal score', () => {
        renderSetup();

        click('Goal score next');
        click('Set test date');
        click('Test date next');
        click('Finish');

        expect(studyPlanService.upsert).not.toHaveBeenCalled();
    });
});