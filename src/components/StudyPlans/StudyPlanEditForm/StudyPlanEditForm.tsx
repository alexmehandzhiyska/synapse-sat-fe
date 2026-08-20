import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import studyPlanService from '../../../services/studyPlanService';

const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

const StudyPlanEditForm = () => {
    const navigate = useNavigate();

    const [goalScore, setGoalScore] = useState<number | null>(null);
    const [testDate, setTestDate] = useState('');
    const [prepStartDate, setPrepStartDate] = useState('');
    const [testDates, setTestDates] = useState<string[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [fieldError, setFieldError] = useState('');

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login');
            return;
        }

        Promise.all([studyPlanService.getOne(), studyPlanService.getTestDates()])
            .then(([plan, dates]) => {
                setTestDates(dates);

                if (plan) {
                    setGoalScore(plan.goalScore);
                    setTestDate(plan.testDate);
                    setPrepStartDate(plan.prepStartDate);
                }
            })
            .catch(() => {
                setLoadError('Could not load your study plan. Try again later.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [navigate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!goalScore || !testDate || !prepStartDate) {
            setFieldError('Fill in all fields to save your plan.');
            return;
        }

        if (prepStartDate < today) {
            setFieldError('Your starting date needs to be today or later.');
            return;
        }

        if (prepStartDate > testDate) {
            setFieldError('Your starting date needs to be before your test date.');
            return;
        }

        setFieldError('');
        setSubmitError('');
        setIsSubmitting(true);

        try {
            await studyPlanService.upsert({ goalScore, testDate, prepStartDate });
            navigate('/profile');
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-6 py-12">
            <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_8px_24px_rgba(19,56,90,0.06)] sm:p-10">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.35em] text-[#2f61c9]">
                    Study plan
                </p>
                <h2 className="mb-8 font-['Space_Grotesk'] text-3xl font-extrabold text-[#13385A]">
                    Update your study plan
                </h2>

                {isLoading && (
                    <div className="flex justify-center py-8">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#2f61c9]" />
                    </div>
                )}

                {!isLoading && loadError && (
                    <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                        {loadError}
                    </p>
                )}

                {!isLoading && !loadError && (
                    <form onSubmit={handleSubmit}>
                        <label className="mb-8 block">
                            <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                Goal score
                            </span>
                            <div className="mb-3 text-center">
                                <span className="font-['Space_Grotesk'] text-4xl font-extrabold text-[#13385A]">
                                    {goalScore ?? '—'}
                                </span>
                                <span className="ml-2 text-base font-bold text-[#5A6B7B]">/ 1600</span>
                            </div>
                            <input
                                type="range"
                                min={400}
                                max={1600}
                                step={10}
                                value={goalScore ?? 1000}
                                onChange={(event) => setGoalScore(Number(event.target.value))}
                                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-100 accent-[#2f61c9]"
                            />
                        </label>

                        <label className="mb-8 block">
                            <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                Test date
                            </span>
                            <select
                                value={testDate}
                                onChange={(event) => setTestDate(event.target.value)}
                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-bold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            >
                                <option value="" disabled>
                                    Select a test date
                                </option>
                                {testDates.map((date) => (
                                    <option key={date} value={date}>
                                        {formatDate(date)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="mb-8 block">
                            <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                Preparation starting date
                            </span>
                            <input
                                type="date"
                                min={today}
                                max={testDate || undefined}
                                value={prepStartDate}
                                onChange={(event) => setPrepStartDate(event.target.value)}
                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-bold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                        </label>

                        {(fieldError || submitError) && (
                            <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                                {fieldError || submitError}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="flex h-12 items-center justify-center rounded-2xl border border-gray-200 px-8 text-sm font-extrabold text-[#1b1b1f] transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#2f61c9] px-10 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:bg-[#8da8df]"
                            >
                                {isSubmitting ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </section>
    );
};

export default StudyPlanEditForm;