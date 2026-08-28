import { useState } from 'react';

import notebookService from '../../services/notebookService';
import type { NotebookEntry } from '../../types/notebook';
import ConfirmModal from '../common/ConfirmModal/ConfirmModal';
import { DOMAIN_LABELS } from '../PracticeTests/ScoreReport/labels';
import NotebookEntryEditForm from './NotebookEntryEditForm';

type NotebookEntryCardProps = {
    entry: NotebookEntry;
    onUpdated: (entry: NotebookEntry) => void;
    onDeleted: (entryId: string) => void;
}

const NotebookEntryCard = ({ entry, onUpdated, onDeleted }: NotebookEntryCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isReflectionExpanded, setIsReflectionExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleteConfirmOpen(false);
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
        <>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(19,56,90,0.06)]">
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setIsExpanded((prev) => !prev)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            setIsExpanded((prev) => !prev);
                        }
                    }}
                    className="mb-4 cursor-pointer border-l-4 border-[#2f61c9] pl-4"
                >
                    <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                        {DOMAIN_LABELS[entry.question.domain]}
                    </span>
                    <p className="text-sm font-semibold leading-6 text-[#13385A]">
                        {entry.question.prompt} {isExpanded ? '▾' : '▸'}
                    </p>
                </div>

                {isExpanded && (
                    <div className="mb-4 space-y-4">
                        {entry.question.passage && (
                            <p className="whitespace-pre-line rounded-xl bg-[#f4f7fb] p-4 text-sm leading-7 text-[#1b1b1f]">
                                {entry.question.passage}
                            </p>
                        )}

                        <div className="space-y-2">
                            {entry.question.answerChoices.map((choice) => (
                                <div
                                    key={choice.id}
                                    className={`flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 ${
                                        choice.isCorrect
                                            ? 'border-emerald-400 bg-emerald-50'
                                            : 'border-slate-200 bg-white'
                                    }`}
                                >
                                    <span
                                        className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border-2 text-xs font-extrabold ${
                                            choice.isCorrect
                                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                                : 'border-slate-300 text-[#13385A]'
                                        }`}
                                    >
                                        {choice.label}
                                    </span>
                                    <span className="text-sm font-semibold text-[#1b1b1f]">
                                        {choice.content}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                        <button
                            type="button"
                            onClick={() => setIsReflectionExpanded((prev) => !prev)}
                            className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#5A6B7B] hover:text-[#2f61c9]"
                        >
                            What / Why / How {isReflectionExpanded ? '▾' : '▸'}
                        </button>

                        {isReflectionExpanded && (
                            <dl className="mt-3 space-y-3">
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
                        )}

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
                                onClick={() => setIsDeleteConfirmOpen(true)}
                                disabled={isDeleting}
                                className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 px-4 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {isDeleteConfirmOpen && (
                <ConfirmModal
                    title="Remove notebook entry?"
                    message="Remove this entry from your Kolb's Notebook?"
                    cancelLabel="Cancel"
                    confirmLabel="Remove"
                    confirmVariant="danger"
                    onCancel={() => setIsDeleteConfirmOpen(false)}
                    onConfirm={handleDelete}
                />
            )}
        </>
    );
};

export default NotebookEntryCard;