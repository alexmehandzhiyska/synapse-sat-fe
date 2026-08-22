import { useState } from 'react';

import notebookService from '../../services/notebookService';
import type { NotebookEntry, UpdateNotebookEntryData } from '../../types/notebook';

type NotebookEntryEditFormProps = {
    entry: NotebookEntry;
    onSave: (entry: NotebookEntry) => void;
    onCancel: () => void;
}

const textareaClassName = 'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100';

const NotebookEntryEditForm = ({ entry, onSave, onCancel }: NotebookEntryEditFormProps) => {
    const [what, setWhat] = useState(entry.what);
    const [why, setWhy] = useState(entry.why);
    const [how, setHow] = useState(entry.how);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');
        setIsSubmitting(true);

        const data: UpdateNotebookEntryData = { what, why, how };

        try {
            const updated = await notebookService.update(entry.id, data);
            onSave(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <label className="block">
                <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                    What?
                </span>
                <textarea
                    rows={2}
                    value={what}
                    onChange={(event) => setWhat(event.target.value)}
                    className={textareaClassName}
                />
            </label>

            <label className="block">
                <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                    Why?
                </span>
                <textarea
                    rows={2}
                    value={why}
                    onChange={(event) => setWhy(event.target.value)}
                    className={textareaClassName}
                />
            </label>

            <label className="block">
                <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                    How?
                </span>
                <textarea
                    rows={2}
                    value={how}
                    onChange={(event) => setHow(event.target.value)}
                    className={textareaClassName}
                />
            </label>

            {error && (
                <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600">
                    {error}
                </p>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !what || !why || !how}
                    className="flex h-10 items-center justify-center rounded-xl bg-[#2f61c9] px-5 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:bg-[#8da8df]"
                >
                    {isSubmitting ? 'Saving...' : 'Save changes'}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="flex h-10 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-extrabold text-[#1b1b1f] transition hover:bg-gray-50"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default NotebookEntryEditForm;