import { useEffect, useState } from 'react';

import flashcardService from '../../services/flashcardService';
import type { Flashcard } from '../../types/flashcard';
import FlashcardList from './FlashcardList';
import FlashcardReview from './FlashcardReview';

type FlashcardsTab = 'review' | 'all';

const Flashcards = () => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<FlashcardsTab>('review');
    const [pageOpenedAt] = useState(() => Date.now());

    useEffect(() => {
        flashcardService
            .getAll()
            .then(setFlashcards)
            .catch(() => {
                setError('Error loading your flashcards. Try again later');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleReviewed = (reviewedFlashcard: Flashcard) => {
        setFlashcards((prev) =>
            prev.map((flashcard) => (flashcard.id === reviewedFlashcard.id ? reviewedFlashcard : flashcard)),
        );
    };

    const handleDeleted = (flashcardId: string) => {
        setFlashcards((prev) => prev.filter((flashcard) => flashcard.id !== flashcardId));
    };

    const dueCount = flashcards.filter((flashcard) => new Date(flashcard.dueAt).getTime() <= pageOpenedAt).length;

    return (
        <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-2xl">
                <div className="mb-9">
                    <h1 className="mb-3 font-['Space_Grotesk'] text-4xl font-extrabold leading-tight text-[#13385A] sm:text-5xl">
                        My Flashcards
                    </h1>
                </div>

                {isLoading && (
                    <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
                )}

                {!isLoading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-800">
                        <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold">
                            We couldn't load your flashcards
                        </h2>
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                {!isLoading && !error && flashcards.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                        <h2 className="mb-3 font-['Space_Grotesk'] text-2xl font-extrabold text-[#1b1b1f]">
                            You have no flashcards yet
                        </h2>
                        <p className="font-semibold text-[#5A6B7B]">
                            Double-click a word in a question to save it as a flashcard.
                        </p>
                    </div>
                )}

                {!isLoading && !error && flashcards.length > 0 && (
                    <>
                        <div className="mb-6 inline-flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('review')}
                                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${activeTab === 'review' ? 'bg-[#13385A] text-white' : 'text-[#13385A] hover:bg-slate-100'}`}
                            >
                                Review ({dueCount} due)
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('all')}
                                className={`rounded-lg px-4 py-2 text-sm font-bold transition ${activeTab === 'all' ? 'bg-[#13385A] text-white' : 'text-[#13385A] hover:bg-slate-100'}`}
                            >
                                All cards ({flashcards.length})
                            </button>
                        </div>

                        {activeTab === 'review' ? (
                            <FlashcardReview flashcards={flashcards} onReviewed={handleReviewed} />
                        ) : (
                            <FlashcardList flashcards={flashcards} onDeleted={handleDeleted} />
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default Flashcards;