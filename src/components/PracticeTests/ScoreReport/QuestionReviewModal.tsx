import { useState } from 'react';

import notebookService from '../../../services/notebookService';
import type { QuestionResult } from '../../../types/score';
import { DOMAIN_LABELS } from './labels';

interface QuestionReviewModalProps {
    question: QuestionResult;
    onClose: () => void;
}

const STATUS_LABELS: Record<QuestionResult['status'], string> = {
    correct: 'Correct',
    incorrect: 'Incorrect',
    omitted: 'Omitted',
};

const STATUS_CLASSES: Record<QuestionResult['status'], string> = {
    correct: 'bg-emerald-50 text-emerald-700',
    incorrect: 'bg-red-50 text-red-700',
    omitted: 'bg-slate-100 text-[#5A6B7B]',
};

const QuestionReviewModal = ({ question, onClose }: QuestionReviewModalProps) => {
    const [isAdding, setIsAdding] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [what, setWhat] = useState('');
    const [why, setWhy] = useState('');
    const [how, setHow] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleAddToNotebook = async () => {
        setError('');
        setIsSubmitting(true);

        try {
            await notebookService.create({ questionId: question.id, what, why, how });
            setIsAdded(true);
            setIsAdding(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
            <div
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#5A6B7B]">
                        <span className="font-extrabold text-[#13385A]">Q{question.position}</span>
                        <span>·</span>
                        <span>{DOMAIN_LABELS[question.domain]}</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${STATUS_CLASSES[question.status]}`}>
                            {STATUS_LABELS[question.status]}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-[#5A6B7B] transition hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                {question.passage && (
                    <p className="mb-4 whitespace-pre-line text-sm leading-7 text-[#1b1b1f]">
                        {question.passage}
                    </p>
                )}

                <p className="mb-4 font-semibold leading-7 text-[#13385A]">
                    {question.prompt}
                </p>

                <div className="mb-6 space-y-2">
                    {question.answerChoices.map((choice) => {
                        const isSelected = choice.id === question.selectedChoiceId;

                        return (
                            <div
                                key={choice.id}
                                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 ${
                                    choice.isCorrect
                                        ? 'border-emerald-400 bg-emerald-50'
                                        : isSelected
                                            ? 'border-red-400 bg-red-50'
                                            : 'border-slate-200 bg-white'
                                }`}
                            >
                                <span
                                    className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border-2 text-xs font-extrabold ${
                                        choice.isCorrect
                                            ? 'border-emerald-500 bg-emerald-500 text-white'
                                            : isSelected
                                                ? 'border-red-500 bg-red-500 text-white'
                                                : 'border-slate-300 text-[#13385A]'
                                    }`}
                                >
                                    {choice.label}
                                </span>
                                <span className="text-sm font-semibold text-[#1b1b1f]">
                                    {choice.content}
                                </span>
                                {isSelected && !choice.isCorrect && (
                                    <span className="ml-auto text-xs font-bold text-red-600">Your answer</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {isAdded && (
                    <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                        Added to your Kolb's Notebook.
                    </p>
                )}

                {!isAdded && !isAdding && (
                    <button
                        type="button"
                        onClick={() => setIsAdding(true)}
                        className="flex h-11 items-center justify-center rounded-2xl bg-[#2f61c9] px-6 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8]"
                    >
                        Add to Kolb's Notebook
                    </button>
                )}

                {isAdding && (
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-[#f4f7fb] p-5">
                        <label className="block">
                            <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                                What?
                            </span>
                            <textarea
                                rows={2}
                                value={what}
                                onChange={(event) => setWhat(event.target.value)}
                                placeholder="What did you get wrong? What was the mistake type?"
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:ring-4 focus:ring-blue-100"
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
                                placeholder="Why did you make this mistake?"
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:ring-4 focus:ring-blue-100"
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
                                placeholder="How will you avoid this mistake next time?"
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:ring-4 focus:ring-blue-100"
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
                                onClick={handleAddToNotebook}
                                disabled={isSubmitting || !what || !why || !how}
                                className="flex h-10 items-center justify-center rounded-xl bg-[#2f61c9] px-5 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:bg-[#8da8df]"
                            >
                                {isSubmitting ? 'Saving...' : 'Save to notebook'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="flex h-10 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-extrabold text-[#1b1b1f] transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionReviewModal;