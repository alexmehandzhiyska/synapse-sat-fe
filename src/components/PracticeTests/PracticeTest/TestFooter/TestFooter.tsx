interface TestFooterProps {
    currentIndex: number;
    questionCount: number;
    isLastModule: boolean;
    isSubmitting: boolean;
    isNavigatorOpen: boolean;
    onNavigate: (index: number) => void;
    onToggleNavigator: () => void;
    onFinishModule: () => void;
}

const TestFooter = ({
    currentIndex,
    questionCount,
    isLastModule,
    isSubmitting,
    isNavigatorOpen,
    onNavigate,
    onToggleNavigator,
    onFinishModule,
}: TestFooterProps) => {
    const isLastQuestion = currentIndex === questionCount - 1;

    return (
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:px-10">
            <button
                type="button"
                onClick={() => onNavigate(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-bold text-[#13385A] transition hover:border-blue-200 disabled:opacity-40"
            >
                Back
            </button>

            <button
                type="button"
                onClick={onToggleNavigator}
                aria-expanded={isNavigatorOpen}
                className="rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-bold text-[#13385A] transition hover:border-blue-200"
            >
                Question {currentIndex + 1} of {questionCount}
                <span className="ml-2 text-xs text-[#5A6B7B]">{isNavigatorOpen ? '▾' : '▴'}</span>
            </button>

            {isLastQuestion ? (
                <button
                    type="button"
                    onClick={onFinishModule}
                    disabled={isSubmitting}
                    className="rounded-xl bg-[#13385A] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e2b45] disabled:opacity-60"
                >
                    {isLastModule
                        ? isSubmitting
                            ? 'Submitting…'
                            : 'Finish test'
                        : 'Next module'}
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
    );
};

export default TestFooter;