import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';

import type { SectionScore } from '../../../types/score';
import { DOMAIN_LABELS, SECTION_COLORS, SHORT_DOMAIN_LABELS } from './labels';

type DomainAccuracyChartProps = {
    sections: SectionScore[];
};

const READING_WRITING_COLOR = SECTION_COLORS.reading_writing;
const MATH_COLOR = SECTION_COLORS.math;
const PROFILE_COLOR = '#13385A';
const AXIS_LINE_COLOR = '#e2e8f0';
const AXIS_TEXT_COLOR = '#5A6B7B';

type DomainPoint = {
    domain: string;
    label: string;
    axisLabel: string;
    correct: number;
    total: number;
    percent: number;
    sectionName: SectionScore['name'];
};

type RadarDotProps = {
    cx?: number;
    cy?: number;
    payload?: DomainPoint;
};

const RadarDot = ({ cx, cy, payload }: RadarDotProps) => {
    if (cx === undefined || cy === undefined || !payload) {
        return null;
    }

    const fill = payload.sectionName === 'math' ? MATH_COLOR : READING_WRITING_COLOR;

    return <circle cx={cx} cy={cy} r={5} fill={fill} stroke="#fff" strokeWidth={2} />;
};

const DomainAccuracyTooltip = ({ active, payload }: TooltipContentProps) => {
    if (!active || !payload?.length) {
        return null;
    }

    const point = payload[0].payload as DomainPoint;

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(19,56,90,0.12)]">
            <p className="font-['Space_Grotesk'] text-base font-extrabold text-[#13385A]">{point.label}</p>
            <p className="text-xs font-semibold text-[#5A6B7B]">
                {point.correct} / {point.total} correct ({point.percent}%)
            </p>
        </div>
    );
};

const DomainAccuracyChart = ({ sections }: DomainAccuracyChartProps) => {
    const chartData: DomainPoint[] = sections.flatMap((section) => section.domains.map((domain) => ({
        domain: domain.domain,
        label: DOMAIN_LABELS[domain.domain] ?? domain.domain,
        axisLabel: SHORT_DOMAIN_LABELS[domain.domain] ?? DOMAIN_LABELS[domain.domain] ?? domain.domain,
        correct: domain.correct,
        total: domain.total,
        percent: domain.total === 0 ? 0 : Math.round((domain.correct / domain.total) * 100),
        sectionName: section.name,
    })));

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-sm font-extrabold tracking-widest text-slate-400">
                    SKILLS ACCURACY
                </h3>
                <div className="flex items-center gap-3 text-xs font-bold text-[#5A6B7B]">
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: READING_WRITING_COLOR }} />
                        Reading &amp; Writing
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: MATH_COLOR }} />
                        Math
                    </span>
                </div>
            </div>

            <div className="h-72 w-full sm:h-80 [&_*:focus]:outline-none [&_*:focus-visible]:outline-none">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData} outerRadius="70%" margin={{ top: 0, right: 32, bottom: 0, left: 32 }}>
                        <PolarGrid stroke={AXIS_LINE_COLOR} />
                        <PolarAngleAxis dataKey="axisLabel" tick={{ fill: AXIS_TEXT_COLOR, fontSize: 11, fontWeight: 600 }} />
                        <PolarRadiusAxis
                            domain={[0, 100]}
                            angle={67.5}
                            tickCount={5}
                            axisLine={false}
                            tick={{ fill: AXIS_TEXT_COLOR, fontSize: 10 }}
                            tickFormatter={(value: number) => `${value}%`}
                        />
                        <Tooltip content={DomainAccuracyTooltip} />
                        <Radar
                            dataKey="percent"
                            stroke={PROFILE_COLOR}
                            strokeWidth={2}
                            fill={PROFILE_COLOR}
                            fillOpacity={0.1}
                            dot={RadarDot}
                            isAnimationActive={false}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DomainAccuracyChart;