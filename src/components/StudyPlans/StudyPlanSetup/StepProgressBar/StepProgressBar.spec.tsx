import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import StepProgressBar from './StepProgressBar';

const renderSegments = (currentStep: number, totalSteps: number) => {
    const { container } = render(<StepProgressBar currentStep={currentStep} totalSteps={totalSteps} />);

    return Array.from((container.firstChild as HTMLElement).children);
};

const isFilled = (segment: Element) => segment.classList.contains('bg-[#2f61c9]');

describe('StepProgressBar', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders one segment per step', () => {
        expect(renderSegments(1, 3)).toHaveLength(3);
    });

    it('fills segments up to current step', () => {
        expect(renderSegments(2, 3).map(isFilled)).toEqual([true, true, false]);
    });

    it('fills no segments before first step', () => {
        expect(renderSegments(0, 3).map(isFilled)).toEqual([false, false, false]);
    });

    it('fills all segments on last step', () => {
        expect(renderSegments(3, 3).map(isFilled)).toEqual([true, true, true]);
    });
});