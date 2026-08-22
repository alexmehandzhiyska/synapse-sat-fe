import { useState } from 'react';

import type { Question, SectionName } from '../../../types/practiceTest';
import { DOMAIN_LABELS } from '../ScoreReport/labels';
import QuestionEditForm from './QuestionEditForm';

type QuestionCardProps = {
    question: Question;
    sectionName: SectionName;
    onUpdated: (question: Question) => void;
}

const QuestionCard = ({ question, sectionName, onUpdated }: QuestionCardProps) => {
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(19,56,90,0.06)]">
                <QuestionEditForm
                    question={question}
                    sectionName={sectionName}
                    onSave={(updated) => {
                        onUpdated(updated);
                        setIsEditing(false);
                    }}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(19,56,90,0.06)]">
            <button
                type="button"
                onClick={() => setIsEditing(true)}
                aria-label="Edit question"
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-[#5A6B7B] transition hover:border-blue-200 hover:text-[#2f61c9]"
            >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4">
                    <path
                        d="M13.5 3.5a1.5 1.5 0 0 1 2.12 2.12L6.5 14.75l-2.83.71.71-2.83L13.5 3.5Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <div className="mb-3 flex flex-wrap items-center gap-2 pr-10 text-sm font-semibold text-[#5A6B7B]">
                <span className="font-extrabold text-[#13385A]">Q{question.position}</span>
                <span>·</span>
                <span>{DOMAIN_LABELS[question.domain]}</span>
                <span>·</span>
                <span className="capitalize">{question.difficulty}</span>
            </div>

            {question.passage && (
                <p className="mb-4 whitespace-pre-line text-sm leading-7 text-[#1b1b1f]">
                    {question.passage}
                </p>
            )}

            <p className="mb-4 font-semibold leading-7 text-[#13385A]">
                {question.prompt}
            </p>

            <div className="space-y-2">
                {question.answerChoices.map((choice) => (
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
    );
};

export default QuestionCard;