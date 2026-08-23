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

import type { DomainScore } from '../../../types/score';
import { DOMAIN_LABELS, SHORT_DOMAIN_LABELS } from './labels';

type SectionSkillsRadarProps = {
    domains: DomainScore[];
    color: string;
};

const AXIS_LINE_COLOR = '#e2e8f0';
const AXIS_TEXT_COLOR = '#5A6B7B';

type DomainPoint = {
    domain: string;
    label: string;
    axisLabel: string;
    correct: number;
    total: number;
    percent: number;
};

type RadarDotProps = {
    cx?: number;
    cy?: number;
    payload?: DomainPoint;
};

const SectionSkillsRadar = ({ domains, color }: SectionSkillsRadarProps) => {
    const chartData: DomainPoint[] = domains.map((domain) => ({
        domain: domain.domain,
        label: DOMAIN_LABELS[domain.domain] ?? domain.domain,
        axisLabel: SHORT_DOMAIN_LABELS[domain.domain] ?? DOMAIN_LABELS[domain.domain] ?? domain.domain,
        correct: domain.correct,
        total: domain.total,
        percent: domain.total === 0 ? 0 : Math.round((domain.correct / domain.total) * 100),
    }));

    const RadarDot = ({ cx, cy, payload }: RadarDotProps) => {
        if (cx === undefined || cy === undefined || !payload) {
            return null;
        }

        return <circle cx={cx} cy={cy} r={4} fill={color} stroke="#fff" strokeWidth={2} />;
    };

    const SkillsTooltip = ({ active, payload }: TooltipContentProps) => {
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

    return (
        <div className="h-72 w-full [&_*:focus]:outline-none [&_*:focus-visible]:outline-none">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData} outerRadius="58%" margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
                    <PolarGrid stroke={AXIS_LINE_COLOR} />
                    <PolarAngleAxis dataKey="axisLabel" tick={{ fill: AXIS_TEXT_COLOR, fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis
                        domain={[0, 100]}
                        angle={45}
                        tickCount={3}
                        axisLine={false}
                        tick={{ fill: AXIS_TEXT_COLOR, fontSize: 10 }}
                        tickFormatter={(value: number) => `${value}%`}
                    />
                    <Tooltip content={SkillsTooltip} />
                    <Radar
                        dataKey="percent"
                        stroke={color}
                        strokeWidth={2}
                        fill={color}
                        fillOpacity={0.15}
                        dot={RadarDot}
                        isAnimationActive={false}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SectionSkillsRadar;