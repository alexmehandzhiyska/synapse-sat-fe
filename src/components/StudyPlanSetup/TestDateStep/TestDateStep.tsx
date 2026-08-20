import { useEffect, useState } from 'react';

import studyPlanService from '../../../services/studyPlanService';

type TestDateStepProps = {
    value: string;
    onChange: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
};

const formatDate = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

const TestDateStep = ({ value, onChange, onNext, onBack }: TestDateStepProps) => {
    const [testDates, setTestDates] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        studyPlanService
            .getTestDates()
            .then(setTestDates)
            .catch(() => setLoadError('Could not load available test dates. Try again later.'))
            .finally(() => setIsLoading(false));
    }, []);

    const handleNext = () => {
        if (!value) {
            setError('Pick your test date to continue.');
            return;
        }

        setError('');
        onNext();
    };

    return (
        <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.35em] text-[#2f61c9]">
                Test day
            </p>
            <h2 className="mb-3 font-['Space_Grotesk'] text-3xl font-extrabold text-[#13385A]">
                When are you taking the SAT?
            </h2>
            <p className="mb-8 text-sm font-medium text-[#5A6B7B]">
                Pick your official College Board test date. We'll use it to pace your prep.
            </p>

            {isLoading && (
                <div className="mb-8 flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#2f61c9]" />
                </div>
            )}

            {!isLoading && loadError && (
                <p className="mb-8 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                    {loadError}
                </p>
            )}

            {!isLoading && !loadError && (
                <div className="mb-8 space-y-3">
                    {testDates.map((date) => (
                        <button
                            key={date}
                            type="button"
                            onClick={() => onChange(date)}
                            className={`flex h-14 w-full items-center justify-center rounded-2xl border text-sm font-bold transition ${
                                value === date
                                    ? 'border-[#2f61c9] bg-blue-50 text-[#2f61c9]'
                                    : 'border-gray-200 text-[#1b1b1f] hover:border-[#2f61c9]'
                            }`}
                        >
                            {formatDate(date)}
                        </button>
                    ))}
                </div>
            )}

            {error && (
                <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex h-12 items-center justify-center rounded-2xl border border-gray-200 px-8 text-sm font-extrabold text-[#1b1b1f] transition hover:bg-gray-50"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#2f61c9] px-10 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8]"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default TestDateStep;