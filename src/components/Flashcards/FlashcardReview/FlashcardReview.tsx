import { useState } from 'react';

import flashcardService from '../../../services/flashcardService';
import type { Flashcard, FlashcardRating } from '../../../types/flashcard';
import FlashcardCard from '../FlashcardCard/FlashcardCard';

interface FlashcardReviewProps {
    flashcards: Flashcard[];
    onReviewed: (flashcard: Flashcard) => void;
}

const FlashcardReview = ({ flashcards, onReviewed }: FlashcardReviewProps) => {
    const [sessionStart] = useState(() => Date.now());
    const [isFlipped, setIsFlipped] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const dueFlashcards = flashcards
        .filter((flashcard) => new Date(flashcard.dueAt).getTime() <= sessionStart)
        .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());

    const currentFlashcard = dueFlashcards[0];

    const handleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    const handleRate = async (rating: FlashcardRating) => {
        setError('');
        setIsSubmitting(true);

        try {
            const reviewed = await flashcardService.review(currentFlashcard.id, rating);
            setIsFlipped(false);
            onReviewed(reviewed);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!currentFlashcard) {
        const nextDueAt = Math.min(...flashcards.map((flashcard) => new Date(flashcard.dueAt).getTime()));

        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <h2 className="mb-3 font-['Space_Grotesk'] text-2xl font-extrabold text-[#1b1b1f]">All caught up</h2>
                <p className="font-semibold text-[#5A6B7B]">
                    Your next card is due on {new Date(nextDueAt).toLocaleDateString()}.
                </p>
            </div>
        );
    }

    return (
        <>
            <p className="mb-4 text-sm font-bold text-[#5A6B7B]">
                {dueFlashcards.length} {dueFlashcards.length === 1 ? 'card' : 'cards'} left
            </p>

            <FlashcardCard
                key={currentFlashcard.id}
                flashcard={currentFlashcard}
                isFlipped={isFlipped}
                onFlip={handleFlip}
            />

            {error && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600">{error}</p>
            )}

            {isFlipped && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => handleRate('forgot')}
                        disabled={isSubmitting}
                        className="rounded-xl border-2 border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Forgot
                    </button>
                    <button
                        type="button"
                        onClick={() => handleRate('knew_it')}
                        disabled={isSubmitting}
                        className="rounded-xl bg-[#13385A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0e2b45] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Knew it
                    </button>
                </div>
            )}
        </>
    );
};

export default FlashcardReview;