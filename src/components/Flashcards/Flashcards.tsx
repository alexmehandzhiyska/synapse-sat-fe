import { useEffect, useState } from 'react';

import flashcardService from '../../services/flashcardService';
import type { Flashcard } from '../../types/flashcard';

const Flashcards = () => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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

    const currentFlashcard = flashcards[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === flashcards.length - 1;

    const handlePrevious = () => {
        setCurrentIndex((prev) => prev - 1);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => prev + 1);
    };

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
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                            <h2 className="mb-4 font-['Space_Grotesk'] text-3xl font-extrabold text-[#13385A]">
                                {currentFlashcard.word}
                            </h2>
                            <p className="mb-6 whitespace-pre-line text-lg font-semibold leading-8 text-[#1b1b1f]">
                                {currentFlashcard.definition}
                            </p>
                            {currentFlashcard.context && (
                                <p className="border-l-4 border-slate-200 pl-4 text-sm font-medium italic text-[#5A6B7B]">
                                    "{currentFlashcard.context}"
                                </p>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                disabled={isFirst}
                                className="rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-[#13385A] transition hover:border-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm font-bold text-[#5A6B7B]">
                                Card {currentIndex + 1} of {flashcards.length}
                            </span>
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={isLast}
                                className="rounded-xl bg-[#13385A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e2b45] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Flashcards;