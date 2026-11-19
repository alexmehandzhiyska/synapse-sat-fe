import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import GoalScoreStep from './GoalScoreStep';

const renderStep = (value: number | null) => {
    const onChange = vi.fn();
    const onNext = vi.fn();

    const { rerender } = render(<GoalScoreStep value={value} onChange={onChange} onNext={onNext} />);

    const rerenderWithValue = (nextValue: number) => {
        rerender(<GoalScoreStep value={nextValue} onChange={onChange} onNext={onNext} />);
    };

    return { onChange, onNext, rerenderWithValue };
};

const getSlider = () => screen.getByRole('slider');

const clickContinue = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
};

describe('GoalScoreStep', () => {
    afterEach(() => {
        cleanup();
    });

    it('shows dash and centers slider without value', () => {
        renderStep(null);

        expect(screen.getByText('—')).toBeInTheDocument();
        expect(getSlider()).toHaveValue('1000');
    });

    it('shows selected score', () => {
        renderStep(1400);

        expect(screen.getByText('1400')).toBeInTheDocument();
        expect(getSlider()).toHaveValue('1400');
    });

    it('calls onChange with numeric slider value', () => {
        const { onChange } = renderStep(1000);

        fireEvent.change(getSlider(), { target: { value: '1250' } });

        expect(onChange).toHaveBeenCalledWith(1250);
    });

    it('shows error when continuing without value', () => {
        const { onNext } = renderStep(null);

        clickContinue();

        expect(screen.getByText('Pick a goal score to continue.')).toBeInTheDocument();
        expect(onNext).not.toHaveBeenCalled();
    });

    it('calls onNext when continuing with value', () => {
        const { onNext } = renderStep(1400);

        clickContinue();

        expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('clears error once continuing with value', () => {
        const { onNext, rerenderWithValue } = renderStep(null);

        clickContinue();
        rerenderWithValue(1400);
        clickContinue();

        expect(screen.queryByText('Pick a goal score to continue.')).not.toBeInTheDocument();
        expect(onNext).toHaveBeenCalledTimes(1);
    });
});