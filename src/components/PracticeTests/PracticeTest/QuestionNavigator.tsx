export type QuestionStatus = 'answered' | 'skipped' | 'current' | 'unreached';

interface QuestionNavigatorProps {
    sectionLabel: string;
    moduleLabel: string;
    statuses: QuestionStatus[];
    onSelect: (index: number) => void;
    onClose: () => void;
}

const SQUARE_STYLES: Record<QuestionStatus, string> = {
    answered: 'border-[#2f61c9] bg-[#2f61c9] text-white',
    skipped: 'border-dashed border-[#2f61c9] bg-white text-[#2f61c9]',
    unreached: 'border-slate-200 bg-white text-[#5A6B7B] hover:border-blue-200',
    current: 'border-[#2f61c9] bg-white text-[#2f61c9] ring-2 ring-[#2f61c9]/40 ring-offset-1',
};

const LEGEND: { status: QuestionStatus; label: string }[] = [
    { status: 'answered', label: 'Answered' },
    { status: 'skipped', label: 'Skipped' },
    { status: 'unreached', label: 'Unreached' },
    { status: 'current', label: 'Current' },
];

const QuestionNavigator = ({
    sectionLabel,
    moduleLabel,
    statuses,
    onSelect,
    onClose,
}: QuestionNavigatorProps) => {
    return (
        <div className="absolute inset-0 z-20 flex items-end justify-center">
            <button
                type="button"
                aria-label="Close question navigator"
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/20"
            />

            <div className="relative z-10 mb-24 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(19,56,90,0.18)]">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <span className="block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                            {sectionLabel} · {moduleLabel}
                        </span>
                        <h2 className="font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                            Go to question
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border-2 border-slate-200 px-3 py-1.5 text-sm font-bold text-[#13385A] transition hover:border-blue-200"
                    >
                        Close
                    </button>
                </div>

                <div className="mb-4 flex flex-wrap gap-4 text-xs font-bold text-[#5A6B7B]">
                    {LEGEND.map(({ status, label }) => (
                        <span key={status} className="inline-flex items-center gap-2">
                            <span className={`h-3 w-3 rounded border-2 ${SQUARE_STYLES[status]}`} />
                            {label}
                        </span>
                    ))}
                </div>

                <div className="flex flex-wrap gap-3">
                    {statuses.map((status, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => onSelect(index)}
                            aria-current={status === 'current'}
                            aria-label={`Go to question ${index + 1}`}
                            className={`h-9 w-9 rounded-lg border-2 text-sm font-bold transition ${SQUARE_STYLES[status]}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionNavigator;