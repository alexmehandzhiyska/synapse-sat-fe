interface ConfirmModalProps {
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    onCancel: () => void;
    onConfirm: () => void;
    confirmVariant?: 'primary' | 'danger';
}

const ConfirmModal = ({
    title,
    message,
    confirmLabel,
    cancelLabel,
    onCancel,
    onConfirm,
    confirmVariant = 'primary',
}: ConfirmModalProps) => {
    const confirmButtonClassName =
        confirmVariant === 'danger'
            ? 'rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700'
            : 'rounded-xl bg-[#13385A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e2b45]';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
                onClick={(event) => event.stopPropagation()}
            >
                <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold text-[#13385A]">{title}</h2>
                <p className="mb-6 text-sm font-medium text-[#5A6B7B]">{message}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-bold text-[#13385A] transition hover:border-blue-200"
                    >
                        {cancelLabel}
                    </button>
                    <button type="button" onClick={onConfirm} className={confirmButtonClassName}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;