import { useState } from 'react';

import flashcardService from '../../../services/flashcardService';
import type { Flashcard } from '../../../types/flashcard';
import ConfirmModal from '../../common/ConfirmModal/ConfirmModal';
import FlashcardEditForm from '../FlashcardEditForm/FlashcardEditForm';

interface FlashcardListProps {
    flashcards: Flashcard[];
    onUpdated: (flashcard: Flashcard) => void;
    onDeleted: (flashcardId: string) => void;
}

const getNextReviewLabel = (dueAt: string): string => {
    const dueDate = new Date(dueAt);
    return dueDate.getTime() <= Date.now() ? 'Due now' : `Next review: ${dueDate.toLocaleDateString()}`;
};

const FlashcardList = ({ flashcards, onUpdated, onDeleted }: FlashcardListProps) => {
    const [flashcardToEdit, setFlashcardToEdit] = useState<Flashcard | null>(null);
    const [flashcardToDelete, setFlashcardToDelete] = useState<Flashcard | null>(null);
    const [error, setError] = useState('');

    const handleSave = (updatedFlashcard: Flashcard) => {
        setFlashcardToEdit(null);
        onUpdated(updatedFlashcard);
    };

    const handleDelete = async (flashcard: Flashcard) => {
        setFlashcardToDelete(null);
        setError('');

        try {
            await flashcardService.remove(flashcard.id);
            onDeleted(flashcard.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        }
    };

    return (
        <>
            {error && (
                <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600">{error}</p>
            )}

            <div className="space-y-4">
                {flashcards.map((flashcard) => (
                    <div
                        key={flashcard.id}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(19,56,90,0.06)]"
                    >
                        <div className="mb-2 flex items-start justify-between gap-4">
                            <h2 className="font-['Space_Grotesk'] text-2xl font-extrabold text-[#13385A]">
                                {flashcard.word}
                            </h2>
                            {flashcardToEdit?.id !== flashcard.id && (
                                <div className="flex flex-none gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFlashcardToEdit(flashcard)}
                                        className="inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-bold text-[#13385A] transition hover:bg-gray-50"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFlashcardToDelete(flashcard)}
                                        className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 px-4 text-sm font-bold text-red-600 transition hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        {flashcardToEdit?.id === flashcard.id ? (
                            <div className="mb-3">
                                <FlashcardEditForm
                                    flashcard={flashcard}
                                    onSave={handleSave}
                                    onCancel={() => setFlashcardToEdit(null)}
                                />
                            </div>
                        ) : (
                            <p className="mb-3 whitespace-pre-line font-semibold leading-7 text-[#1b1b1f]">
                                {flashcard.definition}
                            </p>
                        )}
                        {flashcard.context && (
                            <p className="mb-3 border-l-4 border-slate-200 pl-4 text-sm font-medium italic text-[#5A6B7B]">
                                "{flashcard.context}"
                            </p>
                        )}
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2f61c9]">
                            {getNextReviewLabel(flashcard.dueAt)}
                        </p>
                    </div>
                ))}
            </div>

            {flashcardToDelete && (
                <ConfirmModal
                    title="Delete flashcard?"
                    message={`Delete the flashcard for "${flashcardToDelete.word}"?`}
                    cancelLabel="Cancel"
                    confirmLabel="Delete"
                    confirmVariant="danger"
                    onCancel={() => setFlashcardToDelete(null)}
                    onConfirm={() => handleDelete(flashcardToDelete)}
                />
            )}
        </>
    );
};

export default FlashcardList;