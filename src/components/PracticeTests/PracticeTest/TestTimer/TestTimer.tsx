import { useState } from 'react';

interface TestTimerProps {
    secondsRemaining: number;
}

const WARNING_SECONDS = 5 * 60; // Warning style will be applied when 5 mins are left

const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const TestTimer = ({ secondsRemaining }: TestTimerProps) => {
    const [isHidden, setIsHidden] = useState(false);

    // Like Bluebook, the last 5 minutes are always shown in red and can't be hidden
    const isWarning = secondsRemaining <= WARNING_SECONDS;
    const isVisible = !isHidden || isWarning;

    const handleToggleHidden = () => {
        setIsHidden((prev) => !prev);
    };

    return (
        <div className="flex flex-col items-center">
            {isVisible && (
                <span
                    role="timer"
                    className={`font-['Space_Grotesk'] text-2xl font-extrabold tabular-nums ${isWarning ? 'text-red-600' : 'text-[#13385A]'}`}
                >
                    {formatTime(secondsRemaining)}
                </span>
            )}

            {!isWarning && (
                <button
                    type="button"
                    onClick={handleToggleHidden}
                    className="mt-1 rounded-full border border-slate-300 px-3 py-0.5 text-xs font-bold text-[#5A6B7B] transition hover:border-blue-200 hover:text-[#13385A]"
                >
                    {isHidden ? 'Show' : 'Hide'}
                </button>
            )}
        </div>
    );
};

export default TestTimer;