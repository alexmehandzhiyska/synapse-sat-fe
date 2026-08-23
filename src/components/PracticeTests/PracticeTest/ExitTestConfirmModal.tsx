interface ExitTestConfirmModalProps {
    onCancel: () => void;
    onConfirm: () => void;
}

const ExitTestConfirmModal = ({ onCancel, onConfirm }: ExitTestConfirmModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold text-[#13385A]">
                    Exit practice test?
                </h2>
                <p className="mb-6 text-sm font-medium text-[#5A6B7B]">
                    Your progress is saved. You can resume this test later from where you left off.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-bold text-[#13385A] transition hover:border-blue-200"
                    >
                        Keep going
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                    >
                        Exit test
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExitTestConfirmModal;