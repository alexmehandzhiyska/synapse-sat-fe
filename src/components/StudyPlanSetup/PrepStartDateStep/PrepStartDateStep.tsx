import { useState } from 'react';

type PrepStartDateStepProps = {
    value: string;
    testDate: string;
    onChange: (value: string) => void;
    onFinish: () => void;
    onBack: () => void;
    isSubmitting: boolean;
    submitError: string;
};

const PrepStartDateStep = ({
    value,
    testDate,
    onChange,
    onFinish,
    onBack,
    isSubmitting,
    submitError,
}: PrepStartDateStepProps) => {
    const [error, setError] = useState('');
    const today = new Date().toISOString().split('T')[0];

    const handleFinish = () => {
        if (!value) {
            setError('Pick a starting date to continue.');
            return;
        }

        if (value < today) {
            setError('Your starting date needs to be today or later.');
            return;
        }

        if (value > testDate) {
            setError('Your starting date needs to be before your test date.');
            return;
        }

        setError('');
        onFinish();
    };

    return (
        <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.35em] text-[#2f61c9]">
                Prep start
            </p>
            <h2 className="mb-3 font-['Space_Grotesk'] text-3xl font-extrabold text-[#13385A]">
                When do you want to start prepping?
            </h2>
            <p className="mb-8 text-sm font-medium text-[#5A6B7B]">
                Pick a date that gives you time before {new Date(`${testDate}T00:00:00`).toLocaleDateString()}.
            </p>

            <label className="mb-8 block">
                <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                    Preparation starting date
                </span>
                <input
                    type="date"
                    min={today}
                    max={testDate}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-bold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
            </label>

            {(error || submitError) && (
                <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                    {error || submitError}
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
                    onClick={handleFinish}
                    disabled={isSubmitting}
                    className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-[#2f61c9] px-10 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:bg-[#8da8df]"
                >
                    {isSubmitting ? 'Saving...' : 'Finish'}
                </button>
            </div>
        </div>
    );
};

export default PrepStartDateStep;