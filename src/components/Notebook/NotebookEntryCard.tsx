import { useState } from 'react';

import notebookService from '../../services/notebookService';
import type { NotebookEntry } from '../../types/notebook';
import { DOMAIN_LABELS } from '../PracticeTests/ScoreReport/labels';
import NotebookEntryEditForm from './NotebookEntryEditForm';

type NotebookEntryCardProps = {
    entry: NotebookEntry;
    onUpdated: (entry: NotebookEntry) => void;
    onDeleted: (entryId: string) => void;
}

const NotebookEntryCard = ({ entry, onUpdated, onDeleted }: NotebookEntryCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        if (!window.confirm('Remove this entry from your Kolb\'s Notebook?')) {
            return;
        }

        setError('');
        setIsDeleting(true);

        try {
            await notebookService.remove(entry.id);
            onDeleted(entry.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(19,56,90,0.06)]">
            <div className="mb-4 border-l-4 border-[#2f61c9] pl-4">
                <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                    {DOMAIN_LABELS[entry.question.domain]}
                </span>
                <p className="text-sm font-semibold leading-6 text-[#13385A]">
                    {entry.question.prompt}
                </p>
            </div>

            {isEditing ? (
                <NotebookEntryEditForm
                    entry={entry}
                    onSave={(updated) => {
                        onUpdated(updated);
                        setIsEditing(false);
                    }}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <>
                    <dl className="space-y-3">
                        <div>
                            <dt className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#5A6B7B]">What</dt>
                            <dd className="mt-1 text-sm font-semibold text-[#1b1b1f]">{entry.what}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#5A6B7B]">Why</dt>
                            <dd className="mt-1 text-sm font-semibold text-[#1b1b1f]">{entry.why}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#5A6B7B]">How</dt>
                            <dd className="mt-1 text-sm font-semibold text-[#1b1b1f]">{entry.how}</dd>
                        </div>
                    </dl>

                    {error && (
                        <p className="mt-4 text-xs font-bold text-red-500">{error}</p>
                    )}

                    <div className="mt-5 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-bold text-[#1b1b1f] transition hover:bg-gray-50"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 px-4 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotebookEntryCard;