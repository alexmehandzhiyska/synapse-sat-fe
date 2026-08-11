interface NavigatorItem {
    id: string;
    isAnswered: boolean;
}

interface TestFooterProps {
    questions: NavigatorItem[];
    currentIndex: number;
    isSubmitting: boolean;
    onNavigate: (index: number) => void;
    onSubmit: () => void;
}

const TestFooter = ({
    questions,
    currentIndex,
    isSubmitting,
    onNavigate,
    onSubmit,
}: TestFooterProps) => {
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === questions.length - 1;

    return (
        <div className="border-t border-slate-200 bg-white px-6 py-4 sm:px-10">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={() => onNavigate(currentIndex - 1)}
                    disabled={isFirst}
                    className="rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-bold text-[#13385A] transition hover:border-blue-200 disabled:opacity-40"
                >
                    Back
                </button>

                <div className="flex flex-wrap justify-center gap-2">
                    {questions.map((item, index) => {
                        const isCurrent = index === currentIndex;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => onNavigate(index)}
                                aria-label={`Go to question ${index + 1}`}
                                aria-current={isCurrent}
                                className={`h-9 w-9 rounded-lg border-2 text-sm font-bold transition ${
                                    isCurrent
                                        ? 'border-[#2f61c9] bg-[#2f61c9] text-white'
                                        : item.isAnswered
                                          ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                                          : 'border-slate-200 bg-white text-[#5A6B7B] hover:border-blue-200'
                                }`}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>

                {isLast ? (
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                        className="rounded-xl bg-[#13385A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e2b45] disabled:opacity-60"
                    >
                        {isSubmitting ? 'Submitting…' : 'Finish'}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => onNavigate(currentIndex + 1)}
                        className="rounded-xl bg-[#2f61c9] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#2450a8]"
                    >
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default TestFooter;