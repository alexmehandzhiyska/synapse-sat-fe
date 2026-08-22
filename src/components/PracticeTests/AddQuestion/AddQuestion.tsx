import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import practiceTestService from '../../../services/practiceTestService';
import type { CreateQuestionData, Difficulty, Domain, FullPracticeTest, SectionName } from '../../../types/practiceTest';
import { DOMAIN_LABELS, SECTION_LABELS } from '../ScoreReport/labels';
import { CHOICE_LABELS, DIFFICULTY_OPTIONS, DOMAINS_BY_SECTION } from './domains';

type QuestionFormData = {
    moduleId: string;
    domain: Domain | '';
    difficulty: Difficulty;
    passage: string;
    prompt: string;
    choiceContents: string[];
    correctChoiceIndex: string;
}

const defaultFormValues: QuestionFormData = {
    moduleId: '',
    domain: '',
    difficulty: 'easy',
    passage: '',
    prompt: '',
    choiceContents: ['', '', '', ''],
    correctChoiceIndex: '0',
};

const AddQuestion = () => {
    const navigate = useNavigate();
    const { testId } = useParams<{ testId: string }>();
    const [test, setTest] = useState<FullPracticeTest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        if (!testId) {
            return;
        }

        practiceTestService
            .getOne(testId)
            .then(setTest)
            .catch(() => {
                setLoadError('Error loading the practice test. Try again later');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [testId]);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<QuestionFormData>({ defaultValues: defaultFormValues });

    const moduleOptions: { id: string; sectionName: SectionName; label: string }[] = [];

    for (const section of test?.sections ?? []) {
        for (const module of section.modules) {
            moduleOptions.push({
                id: module.id,
                sectionName: section.name,
                label: `${SECTION_LABELS[section.name]} – Module ${module.position}`,
            });
        }
    }

    const selectedModuleId = watch('moduleId');
    const selectedSection: SectionName | undefined = moduleOptions.find(
        (option) => option.id === selectedModuleId,
    )?.sectionName;
    const domainOptions = selectedSection ? DOMAINS_BY_SECTION[selectedSection] : [];

    const handleFormSubmit = async (data: QuestionFormData) => {
        setSubmitError('');
        setSubmitSuccess(false);

        const payload: CreateQuestionData = {
            domain: data.domain as Domain,
            difficulty: data.difficulty,
            passage: selectedSection === 'reading_writing' ? data.passage : undefined,
            prompt: data.prompt,
            answerChoices: data.choiceContents.map((content, index) => ({
                label: CHOICE_LABELS[index],
                content,
                isCorrect: String(index) === data.correctChoiceIndex,
            }))
        };

        try {
            await practiceTestService.createQuestion(data.moduleId, payload);
            setSubmitSuccess(true);
            reset({ ...defaultFormValues, moduleId: data.moduleId, domain: data.domain });
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
        }
    };

    return (
        <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-3xl">
                <div className="mb-9">
                    <h1 className="mb-3 font-['Space_Grotesk'] text-4xl font-extrabold leading-tight text-[#13385A] sm:text-5xl">
                        Add question
                    </h1>
                    {test && (
                        <p className="text-lg font-semibold leading-8 text-[#5A6B7B]">
                            {test.title}
                        </p>
                    )}
                </div>

                {isLoading && (
                    <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
                )}

                {!isLoading && loadError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-800">
                        <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold">
                            We couldn't load the test
                        </h2>
                        <p className="font-semibold">{loadError}</p>
                    </div>
                )}

                {!isLoading && !loadError && test && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_24px_rgba(19,56,90,0.06)] sm:p-10">
                        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
                            <label className="block">
                                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                                    Module
                                </span>
                                <div className="relative">
                                    <select
                                        className="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 pl-5 pr-10 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        {...register('moduleId', { required: 'Select a module' })}
                                    >
                                        <option value="">Select a module</option>
                                        {moduleOptions.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <svg
                                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A6B7B]"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path d="m5 7 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {errors.moduleId && (
                                    <span className="mt-2 block text-xs font-bold text-red-500">
                                        {errors.moduleId.message}
                                    </span>
                                )}
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                                    Domain
                                </span>
                                <div className="relative">
                                    <select
                                        className="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 pl-5 pr-10 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        disabled={!selectedSection}
                                        {...register('domain', { required: 'Select a domain' })}
                                    >
                                        <option value="">
                                            {selectedSection ? 'Select a domain' : 'Select a module first'}
                                        </option>
                                        {domainOptions.map((domain) => (
                                            <option key={domain} value={domain}>
                                                {DOMAIN_LABELS[domain]}
                                            </option>
                                        ))}
                                    </select>
                                    <svg
                                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A6B7B]"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path d="m5 7 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {errors.domain && (
                                    <span className="mt-2 block text-xs font-bold text-red-500">
                                        {errors.domain.message}
                                    </span>
                                )}
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                                    Difficulty
                                </span>
                                <div className="relative">
                                    <select
                                        className="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 pl-5 pr-10 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        {...register('difficulty', { required: true })}
                                    >
                                        {DIFFICULTY_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <svg
                                        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A6B7B]"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path d="m5 7 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </label>

                            {selectedSection === 'reading_writing' && (
                                <label className="block">
                                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                                        Passage
                                    </span>
                                    <textarea
                                        rows={3}
                                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                                    {CHOICE_LABELS.map((label, index) => (
                                        <div key={label} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                value={String(index)}
                                                className="h-5 w-5 accent-[#2f61c9]"
                                                {...register('correctChoiceIndex', { required: true })}
                                            />
                                            <span className="w-6 font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                                                {label}
                                            </span>
                                            <input
                                                type="text"
                                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                                {...register(`choiceContents.${index}` as const, {
                                                    required: 'Answer choice content is required',
                                                })}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {errors.choiceContents && (
                                    <span className="mt-2 block text-xs font-bold text-red-500">
                                        All answer choices must have content
                                    </span>
                                )}
                            </div>

                            {submitError && (
                                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                                    {submitError}
                                </p>
                            )}

                            {submitSuccess && (
                                <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                                    Question added.
                                </p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex h-12 items-center justify-center rounded-2xl bg-[#2f61c9] px-8 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:bg-[#8da8df]"
                                >
                                    {isSubmitting ? 'Adding...' : 'Add question'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate('/practice-tests')}
                                    className="flex h-12 items-center justify-center rounded-2xl border border-gray-200 px-8 text-sm font-extrabold text-[#1b1b1f] transition hover:bg-gray-50"
                                >
                                    Done
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AddQuestion;