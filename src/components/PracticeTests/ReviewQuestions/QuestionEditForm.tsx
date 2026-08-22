import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import practiceTestService from '../../../services/practiceTestService';
import type { Difficulty, Domain, Question, SectionName, UpdateQuestionData } from '../../../types/practiceTest';
import { DIFFICULTY_OPTIONS, DOMAINS_BY_SECTION } from '../AddQuestion/domains';
import { DOMAIN_LABELS } from '../ScoreReport/labels';

type QuestionEditFormProps = {
    question: Question;
    sectionName: SectionName;
    onSave: (question: Question) => void;
    onCancel: () => void;
}

type EditQuestionFormData = {
    domain: Domain;
    difficulty: Difficulty;
    passage: string;
    prompt: string;
    choiceContents: string[];
    correctChoiceId: string;
}

const selectClassName = 'h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 pl-5 pr-10 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100';
const inputClassName = 'h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100';
const textareaClassName = 'w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100';

const SelectChevron = () => (
    <FontAwesomeIcon
        icon={faChevronDown}
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A6B7B]"
    />
);

const QuestionEditForm = ({ question, sectionName, onSave, onCancel }: QuestionEditFormProps) => {
    const [submitError, setSubmitError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EditQuestionFormData>({
        defaultValues: {
            domain: question.domain as Domain,
            difficulty: question.difficulty as Difficulty,
            passage: question.passage ?? '',
            prompt: question.prompt,
            choiceContents: question.answerChoices.map((choice) => choice.content),
            correctChoiceId: question.answerChoices.find((choice) => choice.isCorrect)?.id ?? '',
        },
    });

    const domainOptions = DOMAINS_BY_SECTION[sectionName];

    const handleFormSubmit = async (data: EditQuestionFormData) => {
        setSubmitError('');

        const payload: UpdateQuestionData = {
            domain: data.domain,
            difficulty: data.difficulty,
            passage: sectionName === 'reading_writing' ? data.passage : undefined,
            prompt: data.prompt,
            answerChoices: question.answerChoices.map((choice, index) => ({
                id: choice.id,
                content: data.choiceContents[index],
                isCorrect: choice.id === data.correctChoiceId,
            })),
        };

        try {
            const updated = await practiceTestService.updateQuestion(question.id, payload);
            onSave(updated);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit(handleFormSubmit)}>
            <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                    Domain
                </span>
                <div className="relative">
                    <select className={selectClassName} {...register('domain', { required: true })}>
                        {domainOptions.map((domain) => (
                            <option key={domain} value={domain}>
                                {DOMAIN_LABELS[domain]}
                            </option>
                        ))}
                    </select>
                    <SelectChevron />
                </div>
            </label>

            <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                    Difficulty
                </span>
                <div className="relative">
                    <select className={selectClassName} {...register('difficulty', { required: true })}>
                        {DIFFICULTY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <SelectChevron />
                </div>
            </label>

            {sectionName === 'reading_writing' && (
                <label className="block">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                        Passage
                    </span>
                    <textarea
                        rows={3}
                        className={textareaClassName}
                        {...register('passage', { required: 'Passage is required' })}
                    />
                    {errors.passage && (
                        <span className="mt-2 block text-xs font-bold text-red-500">
                            {errors.passage.message}
                        </span>
                    )}
                </label>
            )}

            <label className="block">
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                    Prompt
                </span>
                <textarea
                    rows={3}
                    className={textareaClassName}
                    {...register('prompt', { required: 'Prompt is required' })}
                />
                {errors.prompt && (
                    <span className="mt-2 block text-xs font-bold text-red-500">
                        {errors.prompt.message}
                    </span>
                )}
            </label>

            <div>
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                    Answer choices
                </span>
                <div className="space-y-3">
                    {question.answerChoices.map((choice, index) => (
                        <div key={choice.id} className="flex items-center gap-3">
                            <input
                                type="radio"
                                value={choice.id}
                                className="h-5 w-5 accent-[#2f61c9]"
                                {...register('correctChoiceId', { required: true })}
                            />
                            <span className="w-6 font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                                {choice.label}
                            </span>
                            <input
                                type="text"
                                className={inputClassName}
                                {...register(`choiceContents.${index}` as const, {
                                    required: 'Answer choice content is required',
                                })}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {submitError && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                    {submitError}
                </p>
            )}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-11 items-center justify-center rounded-2xl bg-[#2f61c9] px-6 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:bg-[#8da8df]"
                >
                    {isSubmitting ? 'Saving...' : 'Save changes'}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="flex h-11 items-center justify-center rounded-2xl border border-gray-200 px-6 text-sm font-extrabold text-[#1b1b1f] transition hover:bg-gray-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default QuestionEditForm;