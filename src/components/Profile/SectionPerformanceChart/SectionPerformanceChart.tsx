import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { DefaultLegendContentProps, TooltipContentProps } from 'recharts';

import type { TestResult } from '../../../types/testAttempt';
import { SECTION_LABELS } from '../../PracticeTests/ScoreReport/labels';

type SectionPerformanceChartProps = {
    testResults: TestResult[];
}

type ChartPoint = {
    date: string;
    readingWriting: number | null;
    math: number | null;
}

const READING_WRITING_COLOR = '#2f61c9';
const MATH_COLOR = '#eb6834';
const GRIDLINE_COLOR = '#e2e8f0';
const AXIS_TEXT_COLOR = '#5A6B7B';

const SECTION_MIN_SCORE = 200;
const SECTION_MAX_SCORE = 800;
const SCORE_STEP = 50;

const formatTick = (date: string) =>
    new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const getScoreDomain = (scores: number[]): [number, number] => {
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const padding = Math.max(SCORE_STEP, Math.round(((maxScore - minScore) * 0.2) / SCORE_STEP) * SCORE_STEP);

    const domainMin = Math.max(SECTION_MIN_SCORE, Math.floor((minScore - padding) / SCORE_STEP) * SCORE_STEP);
    const domainMax = Math.min(SECTION_MAX_SCORE, Math.ceil((maxScore + padding) / SCORE_STEP) * SCORE_STEP);

    return [domainMin, domainMax];
};

const SectionLegend = ({ payload }: DefaultLegendContentProps) => (
    <div className="mb-2 flex justify-center gap-6">
        {payload?.map((entry) => (
            <div key={entry.value} className="flex items-center gap-2">
                <span className="h-0.5 w-4" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                    {entry.value}
                </span>
            </div>
        ))}
    </div>
);

const SectionPerformanceTooltip = ({ active, payload }: TooltipContentProps) => {
    if (!active || !payload?.length) {
        return null;
    }

    const point = payload[0].payload as ChartPoint;

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(19,56,90,0.12)]">
            <p className="mb-2 text-xs font-semibold text-[#5A6B7B]">
                {new Date(point.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })}
            </p>

            {point.readingWriting !== null && (
                <div className="flex items-center gap-2">
                    <span className="h-0.5 w-3" style={{ backgroundColor: READING_WRITING_COLOR }} />
                    <span className="font-['Space_Grotesk'] text-base font-extrabold text-[#13385A]">
                        {point.readingWriting}
                    </span>
                    <span className="text-xs font-semibold text-[#5A6B7B]">
                        {SECTION_LABELS.reading_writing}
                    </span>
                </div>
            )}

            {point.math !== null && (
                <div className="flex items-center gap-2">
                    <span className="h-0.5 w-3" style={{ backgroundColor: MATH_COLOR }} />
                    <span className="font-['Space_Grotesk'] text-base font-extrabold text-[#13385A]">
                        {point.math}
                    </span>
                    <span className="text-xs font-semibold text-[#5A6B7B]">
                        {SECTION_LABELS.math}
                    </span>
                </div>
            )}
        </div>
    );
};

const SectionPerformanceChart = ({ testResults }: SectionPerformanceChartProps) => {
    const chartData: ChartPoint[] = testResults.toReversed().map((result) => ({
        date: result.completedAt,
        readingWriting: result.sections.find((section) => section.name === 'reading_writing')?.scaled ?? null,
        math: result.sections.find((section) => section.name === 'math')?.scaled ?? null,
    }));

    const scoreDomain = getScoreDomain(
        chartData.flatMap((point) => [point.readingWriting, point.math]).filter((score) => score !== null),
    );

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="mb-4 font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                Reading &amp; Writing vs. Math
            </h3>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                        <CartesianGrid
                            vertical={false}
                            stroke={GRIDLINE_COLOR}
                            strokeDasharray="0"
                        />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatTick}
                            tickLine={false}
                            axisLine={{ stroke: GRIDLINE_COLOR }}
                            tick={{ fill: AXIS_TEXT_COLOR, fontSize: 12 }}
                        />
                        <YAxis
                            domain={scoreDomain}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: AXIS_TEXT_COLOR, fontSize: 12 }}
                            width={40}
                        />
                        <Tooltip content={SectionPerformanceTooltip} />
                        <Legend position="top" content={SectionLegend} />
                        <Line
                            type="monotone"
                            dataKey="readingWriting"
                            name={SECTION_LABELS.reading_writing}
                            stroke={READING_WRITING_COLOR}
                            strokeWidth={2}
                            connectNulls
                            dot={{ r: 4, fill: READING_WRITING_COLOR, stroke: '#fff', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: READING_WRITING_COLOR, stroke: '#fff', strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="math"
                            name={SECTION_LABELS.math}
                            stroke={MATH_COLOR}
                            strokeWidth={2}
                            connectNulls
                            dot={{ r: 4, fill: MATH_COLOR, stroke: '#fff', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: MATH_COLOR, stroke: '#fff', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SectionPerformanceChart;
