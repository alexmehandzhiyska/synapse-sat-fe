import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import lessonsService from '../../../services/lessonsService';
import type { StudyPlanData } from '../../../types/studyPlan';
import type { DomainProgress } from '../../../types/lesson';
import { DOMAIN_LABELS } from '../../PracticeTests/ScoreReport/labels';

type StudyPlanOverviewProps = {
    studyPlan: StudyPlanData | null;
    bestScore: number;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const daysBetween = (from: Date, to: Date) => {
    return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
};

const StudyPlanOverview = ({ studyPlan, bestScore }: StudyPlanOverviewProps) => {
    const [nextDomains, setNextDomains] = useState<DomainProgress[]>([]);

    useEffect(() => {
        if (!studyPlan) {
            return;
        }

        lessonsService.getProgress()
            .then((domains) => {
                setNextDomains(domains.filter((domain) => domain.status !== 'complete').slice(0, 3));
            });
    }, [studyPlan]);

    if (!studyPlan) {
        return (
            <div className="mb-9 rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 p-8 text-center sm:p-10">
                <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold text-[#13385A]">
                    Set up your study plan
                </h2>
                <p className="mx-auto mb-6 max-w-md text-sm font-medium text-[#5A6B7B]">
                    Add a goal score, your test date, and when you want to start prepping —
                    we'll track your progress toward it right here.
                </p>
                <Link
                    to="/study-plan-setup"
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#2f61c9] px-6 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8]"
                >
                    Get started
                </Link>
            </div>
        );
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const daysUntilTest = daysBetween(today, new Date(`${studyPlan.testDate}T00:00:00`));
    const daysIntoPrep = daysBetween(new Date(`${studyPlan.prepStartDate}T00:00:00`), today);

    const stats = [
        {
            label: 'Days until test',
            value: daysUntilTest > 0
                ? `${daysUntilTest} ${daysUntilTest === 1 ? 'day' : 'days'}`
                : daysUntilTest === 0 ? 'Today' : 'Passed',
        },
        {
            label: 'Days into prep',
            value: daysIntoPrep >= 0
                ? `Day ${daysIntoPrep}`
                : `Starts in ${Math.abs(daysIntoPrep)} ${Math.abs(daysIntoPrep) === 1 ? 'day' : 'days'}`,
        },
    ];

    const goalReached = bestScore >= studyPlan.goalScore;
    const progressPercent = Math.min(100, Math.round((bestScore / studyPlan.goalScore) * 100));

    return (
        <div className="mb-9 rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_24px_rgba(19,56,90,0.06)] sm:p-10">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="font-['Space_Grotesk'] text-2xl font-extrabold text-[#13385A]">
                    Study plan
                </h2>
                <Link
                    to="/study-plan-edit"
                    className="text-xs font-bold text-[#2f61c9] transition hover:text-[#244fa8]"
                >
                    Update
                </Link>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
                    >
                        <p className="text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                            {stat.label}
                        </p>
                        <p className="mt-1 font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div>
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                        Score progress
                    </span>
                    <span className="text-xs font-bold text-[#5A6B7B]">
                        {bestScore || '—'} / {studyPlan.goalScore}
                    </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-blue-50">
                    <div
                        className="h-full rounded-full bg-[#2f61c9] transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                {goalReached && (
                    <p className="mt-2 text-xs font-bold text-emerald-600">
                        You've hit your goal score. Nice work.
                    </p>
                )}
            </div>

            {nextDomains.length > 0 && (
                <div className="mt-6 border-t border-slate-200 pt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                            Up next
                        </span>
                        <Link
                            to="/lessons"
                            className="text-xs font-bold text-[#2f61c9] transition hover:text-[#244fa8]"
                        >
                            View course
                        </Link>
                    </div>
                    <ul className="space-y-2">
                        {nextDomains.map((domainProgress) => (
                            <li
                                key={domainProgress.domain}
                                className="flex items-center justify-between rounded-xl bg-[#f4f7fb] px-4 py-2.5 text-sm font-semibold text-[#13385A]"
                            >
                                <span>{DOMAIN_LABELS[domainProgress.domain]}</span>
                                <span className="text-xs font-bold text-[#5A6B7B]">
                                    {domainProgress.lessons.length} {domainProgress.lessons.length === 1 ? 'lesson' : 'lessons'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default StudyPlanOverview;