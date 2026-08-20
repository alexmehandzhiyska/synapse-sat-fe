import { useState } from 'react';

type GoalScoreStepProps = {
    value: number | null;
    onChange: (value: number) => void;
    onNext: () => void;
};

const GoalScoreStep = ({ value, onChange, onNext }: GoalScoreStepProps) => {
    const [error, setError] = useState('');

    const handleNext = () => {
        if (!value) {
            setError('Pick a goal score to continue.');
            return;
        }

        setError('');
        onNext();
    };

    return (
        <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.35em] text-[#2f61c9]">
                Your goal
            </p>
            <h2 className="mb-3 font-['Space_Grotesk'] text-3xl font-extrabold text-[#13385A]">
                What score are you aiming for?
            </h2>
            <p className="mb-8 text-sm font-medium text-[#5A6B7B]">
                Pick a target. You can always adjust it later.
            </p>

            <div className="mb-6 text-center">
                <span className="font-['Space_Grotesk'] text-6xl font-extrabold text-[#13385A]">
                    {value ?? '—'}
                </span>
                <span className="ml-2 text-lg font-bold text-[#5A6B7B]">/ 1600</span>
            </div>

            <input
                type="range"
                min={400}
                max={1600}
                step={10}
                value={value ?? 1000}
                onChange={(event) => onChange(Number(event.target.value))}
                className="mb-6 h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-100 accent-[#2f61c9]"
            />

            {error && (
                <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}

            <button
                type="button"
                onClick={handleNext}
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#2f61c9] px-10 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8]"
            >
                Continue
            </button>
        </div>
    );
};

export default GoalScoreStep;