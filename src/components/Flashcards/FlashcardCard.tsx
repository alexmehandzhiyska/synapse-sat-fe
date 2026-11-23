import type { Flashcard } from '../../types/flashcard';

interface FlashcardCardProps {
    flashcard: Flashcard;
    isFlipped: boolean;
    onFlip: () => void;
}

const FlashcardCard = ({ flashcard, isFlipped, onFlip }: FlashcardCardProps) => {
    return (
        <button
            type="button"
            onClick={onFlip}
            aria-label={isFlipped ? 'Show word' : 'Show definition'}
            className="block h-80 w-full cursor-pointer perspective-distant"
        >
            <div
                className={`relative h-full w-full transition-transform duration-500 transform-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm backface-hidden">
                    <h2 className="font-['Space_Grotesk'] text-4xl font-extrabold text-[#13385A]">{flashcard.word}</h2>
                    <p className="absolute bottom-6 text-xs font-bold uppercase tracking-[0.14em] text-[#5A6B7B]">
                        Click to see definition
                    </p>
                </div>

                <div className="absolute inset-0 flex rotate-y-180 flex-col justify-center overflow-y-auto rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm backface-hidden sm:p-10">
                    <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">{flashcard.word}</p>
                    <p className="mb-6 whitespace-pre-line text-lg font-semibold leading-8 text-[#1b1b1f]">
                        {flashcard.definition}
                    </p>
                    {flashcard.context && (
                        <p className="border-l-4 border-slate-200 pl-4 text-sm font-medium italic text-[#5A6B7B]">
                            "{flashcard.context}"
                        </p>
                    )}
                </div>
            </div>
        </button>
    );
};

export default FlashcardCard;