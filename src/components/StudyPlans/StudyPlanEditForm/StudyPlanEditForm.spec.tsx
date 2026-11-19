import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import studyPlanService from '../../../services/studyPlanService';
import type { StudyPlanData } from '../../../types/studyPlan';
import StudyPlanEditForm from './StudyPlanEditForm';

const navigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => ({
    ...(await importOriginal<typeof import('react-router-dom')>()),
    useNavigate: () => navigate,
}));

vi.mock('../../../services/studyPlanService', () => ({
    default: { getOne: vi.fn(), getTestDates: vi.fn(), upsert: vi.fn() },
}));

const studyPlan: StudyPlanData = {
    goalScore: 1400,
    testDate: '2027-03-13',
    prepStartDate: '2027-02-01',
};

const renderForm = () => {
    const { container } = render(
        <MemoryRouter>
            <StudyPlanEditForm />
        </MemoryRouter>,
    );

    return { container };
};

const renderLoadedForm = async () => {
    renderForm();

    await screen.findByRole('button', { name: 'Save changes' });
};

const getGoalScoreSlider = () => screen.getByRole('slider');
const getTestDateSelect = () => screen.getByRole('combobox');
const getPrepStartDateInput = () => screen.getByLabelText('Preparation starting date');

const changePrepStartDate = (value: string) => {
    fireEvent.change(getPrepStartDateInput(), { target: { value } });
};

const save = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
};

const submitSkippingBrowserValidation = () => {
    fireEvent.submit(screen.getByRole('button', { name: 'Save changes' }).closest('form') as HTMLFormElement);
};

describe('StudyPlanEditForm', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2027-01-10T12:00:00Z'));
        localStorage.setItem('accessToken', 'access-token');
        navigate.mockReset();
        vi.mocked(studyPlanService.getOne).mockReset().mockResolvedValue(studyPlan);
        vi.mocked(studyPlanService.getTestDates).mockReset().mockResolvedValue(['2027-03-13', '2027-05-01']);
        vi.mocked(studyPlanService.upsert).mockReset().mockResolvedValue(studyPlan);
    });

    afterEach(() => {
        cleanup();
        localStorage.clear();
        vi.useRealTimers();
    });

    it('redirects to login when logged out', () => {
        localStorage.clear();

        renderForm();

        expect(navigate).toHaveBeenCalledWith('/login');
        expect(studyPlanService.getOne).not.toHaveBeenCalled();
    });

    it('shows spinner while loading', () => {
        vi.mocked(studyPlanService.getOne).mockReturnValue(new Promise(() => {}));

        const { container } = renderForm();

        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('shows error when loading fails', async () => {
        vi.mocked(studyPlanService.getTestDates).mockRejectedValue(new Error('Server error'));

        renderForm();

        expect(await screen.findByText('Could not load your study plan. Try again later.')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Save changes' })).not.toBeInTheDocument();
    });

    it('prefills form with study plan', async () => {
        await renderLoadedForm();

        expect(screen.getByText('1400')).toBeInTheDocument();
        expect(getGoalScoreSlider()).toHaveValue('1400');
        expect(getTestDateSelect()).toHaveValue('2027-03-13');
        expect(getPrepStartDateInput()).toHaveValue('2027-02-01');
    });

    it('leaves form empty without study plan', async () => {
        vi.mocked(studyPlanService.getOne).mockResolvedValue(null);

        await renderLoadedForm();

        expect(screen.getByText('—')).toBeInTheDocument();
        expect(getGoalScoreSlider()).toHaveValue('1000');
        expect(getTestDateSelect()).toHaveValue('');
        expect(getPrepStartDateInput()).toHaveValue('');
    });

    it('renders formatted test dates as options', async () => {
        await renderLoadedForm();

        expect(screen.getByRole('option', { name: 'March 13, 2027' })).toHaveValue('2027-03-13');
        expect(screen.getByRole('option', { name: 'May 1, 2027' })).toHaveValue('2027-05-01');
    });

    it('limits prep start date between today and test date', async () => {
        await renderLoadedForm();

        expect(getPrepStartDateInput()).toHaveAttribute('min', '2027-01-10');
        expect(getPrepStartDateInput()).toHaveAttribute('max', '2027-03-13');
    });

    it('updates goal score from slider', async () => {
        await renderLoadedForm();

        fireEvent.change(getGoalScoreSlider(), { target: { value: '1250' } });

        expect(screen.getByText('1250')).toBeInTheDocument();
    });

    it('shows error when fields are missing', async () => {
        vi.mocked(studyPlanService.getOne).mockResolvedValue(null);
        await renderLoadedForm();

        save();

        expect(screen.getByText('Fill in all fields to save your plan.')).toBeInTheDocument();
        expect(studyPlanService.upsert).not.toHaveBeenCalled();
    });

    it('shows error when prep start date is in past', async () => {
        await renderLoadedForm();

        changePrepStartDate('2027-01-09');
        submitSkippingBrowserValidation();

        expect(screen.getByText('Your starting date needs to be today or later.')).toBeInTheDocument();
        expect(studyPlanService.upsert).not.toHaveBeenCalled();
    });

    it('shows error when prep start date is after test date', async () => {
        await renderLoadedForm();

        changePrepStartDate('2027-03-14');
        submitSkippingBrowserValidation();

        expect(screen.getByText('Your starting date needs to be before your test date.')).toBeInTheDocument();
        expect(studyPlanService.upsert).not.toHaveBeenCalled();
    });

    it('saves edited study plan', async () => {
        await renderLoadedForm();

        fireEvent.change(getGoalScoreSlider(), { target: { value: '1500' } });
        fireEvent.change(getTestDateSelect(), { target: { value: '2027-05-01' } });
        changePrepStartDate('2027-03-01');
        save();

        await waitFor(() => {
            expect(studyPlanService.upsert).toHaveBeenCalledWith({ goalScore: 1500, testDate: '2027-05-01', prepStartDate: '2027-03-01' });
        });
    });

    it('navigates to profile after saving', async () => {
        await renderLoadedForm();

        save();

        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/profile');
        });
    });

    it('shows saving state while submitting', async () => {
        vi.mocked(studyPlanService.upsert).mockReturnValue(new Promise(() => {}));
        await renderLoadedForm();

        save();

        expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    });

    it('shows error message when saving fails', async () => {
        vi.mocked(studyPlanService.upsert).mockRejectedValue(new Error('Could not save study plan'));
        await renderLoadedForm();

        save();

        expect(await screen.findByText('Could not save study plan')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
        expect(navigate).not.toHaveBeenCalled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(studyPlanService.upsert).mockRejectedValue('error');
        await renderLoadedForm();

        save();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });

    it('navigates to profile on cancel', async () => {
        await renderLoadedForm();

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(navigate).toHaveBeenCalledWith('/profile');
        expect(studyPlanService.upsert).not.toHaveBeenCalled();
    });
});