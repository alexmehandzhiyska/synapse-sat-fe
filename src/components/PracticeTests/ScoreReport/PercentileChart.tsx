import {
    Bar,
    BarChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';

import type { ScoreDistribution } from '../../../types/score';

type PercentileChartProps = {
    distribution: ScoreDistribution;
}

const BAR_COLOR = '#60a5fa';
const REFERENCE_COLOR = '#ef4444';
const AXIS_LINE_COLOR = '#e2e8f0';
const AXIS_TEXT_COLOR = '#5A6B7B';

const getOrdinalSuffix = (value: number): string => {
    const remainder100 = value % 100;

    if (remainder100 >= 11 && remainder100 <= 13) {
        return 'th';
    }

    switch (value % 10) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
};

type ScoreBadgeProps = {
    viewBox?: { x?: number; y?: number };
    value: number;
};

const ScoreBadge = ({ viewBox, value }: ScoreBadgeProps) => {
    const x = viewBox?.x ?? 0;
    const y = viewBox?.y ?? 0;
    const text = `${value}`;
    const width = Math.max(48, text.length * 13 + 24);

    return (
        <g transform={`translate(${x - width / 2}, ${y - 40})`}>
            <rect width={width} height={28} rx={14} fill={REFERENCE_COLOR} />
            <text x={width / 2} y={14} dy={5} textAnchor="middle" fill="#fff" fontSize={15} fontWeight={800}>
                {text}
            </text>
        </g>
    );
};

type BucketPoint = {
    label: string;
    count: number;
    isYourBucket: boolean;
    bucketStart: number;
    bucketEnd: number;
};

const BucketTooltip = ({ active, payload }: TooltipContentProps) => {
    if (!active || !payload?.length) {
        return null;
    }

    const bucket = payload[0].payload as BucketPoint;

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(19,56,90,0.12)]">
            <p className="font-['Space_Grotesk'] text-xl font-extrabold text-[#13385A]">
                {bucket.bucketStart}–{bucket.bucketEnd}
            </p>
            <p className="text-xs font-semibold text-[#5A6B7B]">
                {bucket.count} {bucket.count === 1 ? 'attempt' : 'attempts'}
            </p>
        </div>
    );
};

const PercentileChart = ({ distribution }: PercentileChartProps) => {
    const bucketPoints: BucketPoint[] = distribution.buckets.map((bucket) => ({
        label: `${bucket.bucketStart}`,
        count: bucket.count,
        isYourBucket: distribution.yourScore >= bucket.bucketStart && distribution.yourScore < bucket.bucketEnd,
        bucketStart: bucket.bucketStart,
        bucketEnd: bucket.bucketEnd,
    }));

    const yourBucketLabel = bucketPoints.find((point) => point.isYourBucket)?.label
        ?? bucketPoints[bucketPoints.length - 1]?.label;

    // Add a zero-height terminal category so the axis shows the range's upper bound
    // (e.g. 1600) instead of stopping at the last bucket's start label.
    const lastBucket = distribution.buckets[distribution.buckets.length - 1];
    const chartData: BucketPoint[] = lastBucket
        ? [...bucketPoints, {
            label: `${lastBucket.bucketEnd}`,
            count: 0,
            isYourBucket: false,
            bucketStart: lastBucket.bucketEnd,
            bucketEnd: lastBucket.bucketEnd,
        }]
        : bucketPoints;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-2 flex items-start justify-between">
                <h3 className="text-sm font-extrabold tracking-widest text-slate-400">
                    PERCENTILE
                </h3>
                <span className="rounded-full border border-slate-300 px-4 py-1.5 text-base font-extrabold text-[#13385A]">
                    {distribution.percentile}{getOrdinalSuffix(distribution.percentile)}
                </span>
            </div>

            <div className="h-56 w-full sm:h-64 [&_*:focus]:outline-none [&_*:focus-visible]:outline-none">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 40, right: 12, bottom: 0, left: 12 }}
                        barCategoryGap="30%"
                        accessibilityLayer={false}
                    >
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            axisLine={{ stroke: AXIS_LINE_COLOR }}
                            tick={{ fill: AXIS_TEXT_COLOR, fontSize: 14 }}
                            dy={8}
                        />
                        <Tooltip content={BucketTooltip} cursor={{ fill: '#f1f5f9' }} />
                        <Bar dataKey="count" fill={BAR_COLOR} radius={[4, 4, 0, 0]} barSize={18} activeBar={{ fill: BAR_COLOR, stroke: 'none' }} />
                        {yourBucketLabel && (
                            <ReferenceLine
                                x={yourBucketLabel}
                                stroke={REFERENCE_COLOR}
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                label={<ScoreBadge value={distribution.yourScore} />}
                            />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <p className="mt-6 text-center text-base font-semibold text-[#5A6B7B]">
                You scored higher than <span className="font-extrabold text-[#13385A]">{distribution.percentile}%</span> of users.
            </p>
        </div>
    );
};

export default PercentileChart;