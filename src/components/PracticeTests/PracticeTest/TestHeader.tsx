interface TestHeaderProps {
    title: string;
    sectionLabel: string;
    currentNumber: number;
    totalQuestions: number;
    isSubmitting: boolean;
    onSubmit: () => void;
}

const TestHeader = ({
    title,
    sectionLabel,
    currentNumber,
    totalQuestions,
    isSubmitting,
    onSubmit,
}: TestHeaderProps) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4 sm:px-10">
            <div>
                <span className="block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                    {sectionLabel}
                </span>
                <h1 className="font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                    {title}
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-[#5A6B7B]">
                    Question {currentNumber} of {totalQuestions}
                </span>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#13385A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e2b45] disabled:opacity-60"
                >
                    {isSubmitting ? 'Submitting…' : 'Submit test'}
                </button>
            </div>
        </div>
    );
};

export default TestHeader;