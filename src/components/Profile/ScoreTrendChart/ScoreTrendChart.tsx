import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';

import type { TestResult } from '../../../types/testAttempt';

type ScoreTrendChartProps = {
    testResults: TestResult[];
}

type ChartPoint = {
    date: string;
    score: number;
}

const SCORE_LINE_COLOR = '#2f61c9';
const GRIDLINE_COLOR = '#e2e8f0';
const AXIS_TEXT_COLOR = '#5A6B7B';

const formatTick = (date: string) =>
    new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

const SAT_MIN_SCORE = 400;
const SAT_MAX_SCORE = 1600;
const SCORE_STEP = 50;

const getScoreDomain = (scores: number[]): [number, number] => {
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const padding = Math.max(SCORE_STEP, Math.round(((maxScore - minScore) * 0.2) / SCORE_STEP) * SCORE_STEP);

    const domainMin = Math.max(SAT_MIN_SCORE, Math.floor((minScore - padding) / SCORE_STEP) * SCORE_STEP);
    const domainMax = Math.min(SAT_MAX_SCORE, Math.ceil((maxScore + padding) / SCORE_STEP) * SCORE_STEP);

    return [domainMin, domainMax];
};

const ScoreTrendTooltip = ({ active, payload }: TooltipContentProps) => {
    if (!active || !payload?.length) {
        return null;
    }

    const point = payload[0].payload as ChartPoint;

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(19,56,90,0.12)]">
            <p className="font-['Space_Grotesk'] text-xl font-extrabold text-[#13385A]">
                {point.score}
            </p>
            <p className="text-xs font-semibold text-[#5A6B7B]">
                {new Date(point.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })}
            </p>
        </div>
    );
};

const ScoreTrendChart = ({ testResults }: ScoreTrendChartProps) => {
    const chartData: ChartPoint[] = testResults
        .toReversed()
        .map((result) => ({ date: result.completedAt, score: result.totalScaled }));

    const scoreDomain = getScoreDomain(chartData.map((point) => point.score));

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="mb-4 font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                Score over time
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
                        <Tooltip content={ScoreTrendTooltip} />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke={SCORE_LINE_COLOR}
                            strokeWidth={2}
                            dot={{ r: 4, fill: SCORE_LINE_COLOR, stroke: '#fff', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: SCORE_LINE_COLOR, stroke: '#fff', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ScoreTrendChart;