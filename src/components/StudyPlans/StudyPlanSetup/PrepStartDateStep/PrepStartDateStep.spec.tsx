import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import PrepStartDateStep from './PrepStartDateStep';

const renderStep = ({ value = '', isSubmitting = false, submitError = '' } = {}) => {
    const onChange = vi.fn();
    const onFinish = vi.fn();
    const onBack = vi.fn();

    render(
        <PrepStartDateStep
            value={value}
            testDate="2027-03-13"
            onChange={onChange}
            onFinish={onFinish}
            onBack={onBack}
            isSubmitting={isSubmitting}
            submitError={submitError}
        />,
    );

    return { onChange, onFinish, onBack };
};

const getDateInput = () => screen.getByLabelText('Preparation starting date');

const clickFinish = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }));
};

describe('PrepStartDateStep', () => {
    beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date('2027-01-10T12:00:00Z'));
    });

    afterEach(() => {
        cleanup();
        vi.useRealTimers();
    });

    it('limits date input between today and test date', () => {
        renderStep();

        expect(getDateInput()).toHaveAttribute('min', '2027-01-10');
        expect(getDateInput()).toHaveAttribute('max', '2027-03-13');
    });

    it('shows selected date', () => {
        renderStep({ value: '2027-02-01' });

        expect(getDateInput()).toHaveValue('2027-02-01');
    });

    it('calls onChange with picked date', () => {
        const { onChange } = renderStep();

        fireEvent.change(getDateInput(), { target: { value: '2027-02-01' } });

        expect(onChange).toHaveBeenCalledWith('2027-02-01');
    });

    it('shows error when finishing without date', () => {
        const { onFinish } = renderStep();

        clickFinish();

        expect(screen.getByText('Pick a starting date to continue.')).toBeInTheDocument();
        expect(onFinish).not.toHaveBeenCalled();
    });

    it('shows error when date is in past', () => {
        const { onFinish } = renderStep({ value: '2027-01-09' });

        clickFinish();

        expect(screen.getByText('Your starting date needs to be today or later.')).toBeInTheDocument();
        expect(onFinish).not.toHaveBeenCalled();
    });

    it('shows error when date is after test date', () => {
        const { onFinish } = renderStep({ value: '2027-03-14' });

        clickFinish();

        expect(screen.getByText('Your starting date needs to be before your test date.')).toBeInTheDocument();
        expect(onFinish).not.toHaveBeenCalled();
    });

    it('accepts today as starting date', () => {
        const { onFinish } = renderStep({ value: '2027-01-10' });

        clickFinish();

        expect(onFinish).toHaveBeenCalledTimes(1);
    });

    it('accepts test date as starting date', () => {
        const { onFinish } = renderStep({ value: '2027-03-13' });

        clickFinish();

        expect(onFinish).toHaveBeenCalledTimes(1);
    });

    it('shows saving state while submitting', () => {
        renderStep({ value: '2027-02-01', isSubmitting: true });

        expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    });

    it('shows submit error', () => {
        renderStep({ value: '2027-02-01', submitError: 'Could not save study plan' });

        expect(screen.getByText('Could not save study plan')).toBeInTheDocument();
    });

    it('shows validation error over submit error', () => {
        renderStep({ submitError: 'Could not save study plan' });

        clickFinish();

        expect(screen.getByText('Pick a starting date to continue.')).toBeInTheDocument();
        expect(screen.queryByText('Could not save study plan')).not.toBeInTheDocument();
    });

    it('calls onBack when back is clicked', () => {
        const { onBack } = renderStep();

        fireEvent.click(screen.getByRole('button', { name: 'Back' }));

        expect(onBack).toHaveBeenCalledTimes(1);
    });
});