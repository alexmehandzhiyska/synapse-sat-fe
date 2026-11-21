import { cleanup, render, screen } from '@testing-library/react';
import type { ComponentType, ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { TestResult, TestResultSectionScore } from '../../../types/testAttempt';
import SectionPerformanceChart from './SectionPerformanceChart';

type TooltipProps = {
    active: boolean;
    payload: { payload: { date: string; readingWriting: number | null; math: number | null } }[];
};

type LegendProps = {
    payload: { value: string; color: string }[];
};

const chart = vi.hoisted(() => ({
    data: [] as unknown[],
    domain: [] as number[],
    formatTick: (date: string) => date,
    Tooltip: (() => null) as ComponentType<TooltipProps>,
    Legend: (() => null) as ComponentType<LegendProps>,
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
    Legend: ({ content }: { content: ComponentType<LegendProps> }) => {
        chart.Legend = content;

        return null;
    },
    Line: () => null,
}));

const createResult = (id: string, completedAt: string, sections: TestResultSectionScore[]): TestResult => ({
    id,
    testId: 'test-1',
    testTitle: 'Test 1',
    completedAt,
    totalScaled: 1300,
    sections,
});

const testResults = [
    createResult('result-2', '2027-01-17T12:00:00Z', [{ name: 'reading_writing', scaled: 650 }, { name: 'math', scaled: 700 }]),
    createResult('result-1', '2027-01-10T12:00:00Z', [{ name: 'reading_writing', scaled: 600 }, { name: 'math', scaled: 650 }]),
];

describe('SectionPerformanceChart', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders title', () => {
        render(<SectionPerformanceChart testResults={testResults} />);

        expect(screen.getByRole('heading', { name: 'Reading & Writing vs. Math' })).toBeInTheDocument();
    });

    it('plots section scores from oldest to newest', () => {
        render(<SectionPerformanceChart testResults={testResults} />);

        expect(chart.data).toEqual([
            { date: '2027-01-10T12:00:00Z', readingWriting: 600, math: 650 },
            { date: '2027-01-17T12:00:00Z', readingWriting: 650, math: 700 },
        ]);
    });

    it('plots missing section score as null', () => {
        render(<SectionPerformanceChart testResults={[createResult('result-1', '2027-01-10T12:00:00Z', [{ name: 'math', scaled: 650 }])]} />);

        expect(chart.data).toEqual([{ date: '2027-01-10T12:00:00Z', readingWriting: null, math: 650 }]);
    });

    it('pads score axis around both sections', () => {
        render(<SectionPerformanceChart testResults={testResults} />);

        expect(chart.domain).toEqual([550, 750]);
    });

    it('ignores missing section scores in score axis', () => {
        render(<SectionPerformanceChart testResults={[createResult('result-1', '2027-01-10T12:00:00Z', [{ name: 'math', scaled: 650 }])]} />);

        expect(chart.domain).toEqual([600, 700]);
    });

    it('limits score axis to section score range', () => {
        render(
            <SectionPerformanceChart
                testResults={[createResult('result-1', '2027-01-10T12:00:00Z', [{ name: 'reading_writing', scaled: 250 }, { name: 'math', scaled: 780 }])]}
            />,
        );

        expect(chart.domain).toEqual([200, 800]);
    });

    it('formats date ticks as month and day', () => {
        render(<SectionPerformanceChart testResults={testResults} />);

        expect(chart.formatTick('2027-01-10T12:00:00Z')).toBe('Jan 10');
    });

    it('shows section names in legend', () => {
        render(<SectionPerformanceChart testResults={testResults} />);
        render(<chart.Legend payload={[{ value: 'Reading and Writing', color: '#2f61c9' }, { value: 'Math', color: '#eb6834' }]} />);

        expect(screen.getByText('Reading and Writing')).toBeInTheDocument();
        expect(screen.getByText('Math')).toBeInTheDocument();
    });

    it('shows date and both section scores in tooltip', () => {
        render(<SectionPerformanceChart testResults={testResults} />);
        render(<chart.Tooltip active payload={[{ payload: { date: '2027-01-10T12:00:00Z', readingWriting: 600, math: 650 } }]} />);

        expect(screen.getByText('Jan 10, 2027')).toBeInTheDocument();
        expect(screen.getByText('600')).toBeInTheDocument();
        expect(screen.getByText('Reading and Writing')).toBeInTheDocument();
        expect(screen.getByText('650')).toBeInTheDocument();
        expect(screen.getByText('Math')).toBeInTheDocument();
    });

    it('hides missing section in tooltip', () => {
        render(<SectionPerformanceChart testResults={testResults} />);
        render(<chart.Tooltip active payload={[{ payload: { date: '2027-01-10T12:00:00Z', readingWriting: null, math: 650 } }]} />);

        expect(screen.queryByText('Reading and Writing')).not.toBeInTheDocument();
        expect(screen.getByText('Math')).toBeInTheDocument();
    });

    it('hides tooltip when inactive', () => {
        render(<SectionPerformanceChart testResults={testResults} />);

        const { container } = render(<chart.Tooltip active={false} payload={[]} />);

        expect(container).toBeEmptyDOMElement();
    });
});