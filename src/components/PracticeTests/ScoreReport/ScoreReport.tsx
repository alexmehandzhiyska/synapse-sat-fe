import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import testAttemptService from '../../../services/testAttemptService';
import type { ScoreReport as ScoreReportData } from '../../../types/score';
import SectionBreakdown from './SectionBreakdown';
import { SECTION_LABELS } from './labels';

const ScoreReport = () => {
    const { attemptId } = useParams<{ attemptId: string }>();

    const [report, setReport] = useState<ScoreReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Load test score
    useEffect(() => {
        if (!attemptId) {
            return;
        }

        testAttemptService
            .getScore(attemptId)
            .then((fetchedReport) => {
                setReport(fetchedReport);
            })
            .catch(() => {
                setError('Error loading your score report. Try again later.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [attemptId]);

    if (isLoading) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-6">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#2f61c9]" />
            </section>
        );
    }

    if (error || !report) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-6">
                <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-800">
                    <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold">
                        We couldn't load your score
                    </h2>
                    <p className="mb-6 font-semibold">{error || 'Please try again later.'}</p>
                    <Link
                        to="/practice-tests"
                        className="inline-flex rounded-xl bg-[#13385A] px-5 py-2.5 font-bold text-white"
                    >
                        Back to practice tests
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#f4f7fb] px-6 py-10 sm:px-10">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-center sm:text-left">
                            <p className="text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                                Your total score
                            </p>
                            <p className="mt-1 font-['Space_Grotesk'] text-5xl font-extrabold leading-none text-[#13385A]">
                                {report.totalScaled}
                                <span className="ml-2 text-xl font-bold text-[#5A6B7B]">
                                    / 1600
                                </span>
                            </p>
                            <p className="mt-2 text-sm font-semibold text-[#5A6B7B]">
                                {report.totalRaw} questions correct
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {report.sections.map((section) => (
                                <div
                                    key={section.name}
                                    className="flex flex-col justify-between rounded-xl bg-[#f4f7fb] px-5 py-3 text-center"
                                >
                                    <p className="text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                                        {SECTION_LABELS[section.name]}
                                    </p>
                                    <p className="mt-1 font-['Space_Grotesk'] text-2xl font-extrabold text-[#2f61c9]">
                                        {section.scaled}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {report.sections.map((section) => (
                    <SectionBreakdown key={section.name} section={section} />
                ))}

                <div className="text-center">
                    <Link
                        to="/practice-tests"
                        className="inline-flex rounded-xl bg-[#13385A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e2b45]"
                    >
                        Back to practice tests
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ScoreReport;