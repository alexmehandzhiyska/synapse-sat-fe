import { useEffect, useState } from 'react';

import flashcardService from '../../../services/flashcardService';

interface AddFlashcardModalProps {
    word: string;
    context: string;
    questionId: string;
    onClose: () => void;
}

const AddFlashcardModal = ({ word, context, questionId, onClose }: AddFlashcardModalProps) => {
    const [definition, setDefinition] = useState('');
    const [isLookingUp, setIsLookingUp] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        flashcardService
            .getSuggestedDefinition(word)
            .then((suggestion) => setDefinition(suggestion.definition ?? ''))
            .catch(() => {}) // The suggestion is optional, so a failed lookup just leaves the definition empty
            .finally(() => setIsLookingUp(false));
    }, [word]);

    const handleSave = async () => {
        setError('');
        setIsSaving(true);

        try {
            await flashcardService.create({ word, definition, context, questionId });
            setIsSaved(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
                onClick={(event) => event.stopPropagation()}
            >
                <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">New flashcard</p>
                <h2 className="mb-2 font-['Space_Grotesk'] text-2xl font-extrabold text-[#13385A]">{word}</h2>
                <p className="mb-6 text-sm font-medium italic text-[#5A6B7B]">"{context}"</p>

                {isSaved ? (
                    <>
                        <p className="mb-6 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-bold text-green-700">
                            Flashcard added
                        </p>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl bg-[#13385A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e2b45]"
                            >
                                Close
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <label className="mb-4 block">
                            <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                                Definition
                            </span>
                            <textarea
                                rows={4}
                                value={definition}
                                onChange={(event) => setDefinition(event.target.value)}
                                disabled={isLookingUp}
                                placeholder={isLookingUp ? 'Looking up definition…' : ''}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                        </label>

                        {!isLookingUp && !definition && (
                            <p className="mb-4 text-sm font-medium text-[#5A6B7B]">
                                No definition found — write your own.
                            </p>
                        )}

                        {error && (
                            <p className="mb-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600">
                                {error}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-bold text-[#13385A] transition hover:border-blue-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isLookingUp || isSaving || !definition.trim()}
                                className="rounded-xl bg-[#13385A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e2b45] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save flashcard'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AddFlashcardModal;