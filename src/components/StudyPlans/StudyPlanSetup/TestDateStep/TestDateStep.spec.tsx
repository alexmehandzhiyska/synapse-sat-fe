import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import studyPlanService from '../../../../services/studyPlanService';
import TestDateStep from './TestDateStep';

vi.mock('../../../../services/studyPlanService', () => ({
    default: { getTestDates: vi.fn() },
}));

const renderStep = (value = '') => {
    const onChange = vi.fn();
    const onNext = vi.fn();
    const onBack = vi.fn();

    const { container } = render(<TestDateStep value={value} onChange={onChange} onNext={onNext} onBack={onBack} />);

    return { onChange, onNext, onBack, container };
};

const findDate = (name: string) => screen.findByRole('button', { name });

const clickContinue = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
};

describe('TestDateStep', () => {
    beforeEach(() => {
        vi.mocked(studyPlanService.getTestDates).mockReset().mockResolvedValue(['2027-03-13', '2027-05-01']);
    });

    afterEach(() => {
        cleanup();
    });

    it('shows spinner while loading test dates', () => {
        vi.mocked(studyPlanService.getTestDates).mockReturnValue(new Promise(() => {}));
        const { container } = renderStep();

        expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('renders formatted test dates', async () => {
        renderStep();

        expect(await findDate('March 13, 2027')).toBeInTheDocument();
        expect(await findDate('May 1, 2027')).toBeInTheDocument();
    });

    it('hides spinner after loading', async () => {
        const { container } = renderStep();

        await findDate('March 13, 2027');

        expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
    });

    it('shows error when test dates fail to load', async () => {
        vi.mocked(studyPlanService.getTestDates).mockRejectedValue(new Error('Server error'));
        renderStep();

        expect(await screen.findByText('Could not load available test dates. Try again later.')).toBeInTheDocument();
    });

    it('calls onChange with clicked date', async () => {
        const { onChange } = renderStep();

        fireEvent.click(await findDate('May 1, 2027'));

        expect(onChange).toHaveBeenCalledWith('2027-05-01');
    });

    it('highlights selected date', async () => {
        renderStep('2027-03-13');

        expect(await findDate('March 13, 2027')).toHaveClass('bg-blue-50');
        expect(await findDate('May 1, 2027')).not.toHaveClass('bg-blue-50');
    });

    it('shows error when continuing without date', async () => {
        const { onNext } = renderStep();

        await findDate('March 13, 2027');
        clickContinue();

        expect(screen.getByText('Pick your test date to continue.')).toBeInTheDocument();
        expect(onNext).not.toHaveBeenCalled();
    });

    it('calls onNext when continuing with date', async () => {
        const { onNext } = renderStep('2027-03-13');

        await findDate('March 13, 2027');
        clickContinue();

        expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('calls onBack when back is clicked', async () => {
        const { onBack } = renderStep();

        await findDate('March 13, 2027');
        fireEvent.click(screen.getByRole('button', { name: 'Back' }));

        expect(onBack).toHaveBeenCalledTimes(1);
    });
});