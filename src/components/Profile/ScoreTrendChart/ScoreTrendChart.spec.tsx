import { cleanup, render, screen } from '@testing-library/react';
import type { ComponentType, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { TestResult } from '../../../types/testAttempt';
import ScoreTrendChart from './ScoreTrendChart';

type TooltipProps = {
    active: boolean;
    payload: { payload: { date: string; score: number } }[];
};

const chart = vi.hoisted(() => ({
    data: [] as unknown[],
    domain: [] as number[],
    formatTick: (date: string) => date,
    Tooltip: (() => null) as ComponentType<TooltipProps>,
}));

vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    LineChart: ({ data, children }: { data: unknown[]; children: ReactNode }) => {
        chart.data = data;

        return <div>{children}</div>;
    },
    CartesianGrid: () => null,
    XAxis: ({ tickFormatter }: { tickFormatter: (date: string) => string }) => {
        chart.formatTick = tickFormatter;

        return null;
    },
    YAxis: ({ domain }: { domain: number[] }) => {
        chart.domain = domain;

        return null;
    },
    Tooltip: ({ content }: { content: ComponentType<TooltipProps> }) => {
        chart.Tooltip = content;

        return null;
    },
    Line: () => null,
}));

const createResult = (id: string, completedAt: string, totalScaled: number): TestResult => ({
    id,
    testId: 'test-1',
    testTitle: 'Test 1',
    completedAt,
    totalScaled,
    sections: [],
});

const testResults = [
    createResult('result-2', '2027-01-17T12:00:00Z', 1300),
    createResult('result-1', '2027-01-10T12:00:00Z', 1200),
];

describe('ScoreTrendChart', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders title', () => {
        render(<ScoreTrendChart testResults={testResults} />);

        expect(screen.getByRole('heading', { name: 'Score over time' })).toBeInTheDocument();
    });

    it('plots scores from oldest to newest', () => {
        render(<ScoreTrendChart testResults={testResults} />);

        expect(chart.data).toEqual([
            { date: '2027-01-10T12:00:00Z', score: 1200 },
            { date: '2027-01-17T12:00:00Z', score: 1300 },
        ]);
    });

    it('pads score axis around scores', () => {
        render(<ScoreTrendChart testResults={testResults} />);

        expect(chart.domain).toEqual([1150, 1350]);
    });

    it('pads score axis around single score', () => {
        render(<ScoreTrendChart testResults={[createResult('result-1', '2027-01-10T12:00:00Z', 1200)]} />);

        expect(chart.domain).toEqual([1150, 1250]);
    });

    it('limits score axis to SAT score range', () => {
        render(
            <ScoreTrendChart
                testResults={[
                    createResult('result-2', '2027-01-17T12:00:00Z', 1550),
                    createResult('result-1', '2027-01-10T12:00:00Z', 450),
                ]}
            />,
        );

        expect(chart.domain).toEqual([400, 1600]);
    });

    it('formats date ticks as month and day', () => {
        render(<ScoreTrendChart testResults={testResults} />);

        expect(chart.formatTick('2027-01-10T12:00:00Z')).toBe('Jan 10');
    });

    it('shows score and date in tooltip', () => {
        render(<ScoreTrendChart testResults={testResults} />);
        render(<chart.Tooltip active payload={[{ payload: { date: '2027-01-10T12:00:00Z', score: 1200 } }]} />);

        expect(screen.getByText('1200')).toBeInTheDocument();
        expect(screen.getByText('Jan 10, 2027')).toBeInTheDocument();
    });

    it('hides tooltip when inactive', () => {
        render(<ScoreTrendChart testResults={testResults} />);

        const { container } = render(<chart.Tooltip active={false} payload={[]} />);

        expect(container).toBeEmptyDOMElement();
    });
});