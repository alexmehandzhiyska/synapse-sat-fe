import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import practiceTestService from '../../../services/practiceTestService';
import testAttemptService from '../../../services/testAttemptService';
import type { FullPracticeTest, Question as QuestionData, SectionName } from '../../../types/practiceTest';
import ModuleCompletionInterstitial from './ModuleCompletionInterstitial';
import Question from './Question';
import QuestionNavigator from './QuestionNavigator';
import type { QuestionStatus } from './QuestionNavigator';
import TestHeader from './TestHeader';

interface TestModule {
    sectionName: SectionName;
    position: number;
    questions: QuestionData[];
}

const SECTION_LABELS: Record<SectionName, string> = {
    reading_writing: 'Reading and Writing',
    math: 'Math',
};

const MODULE_TRANSITION_MS = 3000;

const flattenModules = (test: FullPracticeTest): TestModule[] => {
    const modules: TestModule[] = [];

    for (const section of test.sections) {
        for (const module of section.modules) {
            modules.push({
                sectionName: section.name,
                position: module.position,
                questions: module.questions,
            });
        }
    }

    return modules;
};

const PracticeTest = () => {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();

    const [test, setTest] = useState<FullPracticeTest | null>(null);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<string, string | null>>({});
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [visitedQuestionIds, setVisitedQuestionIds] = useState<Set<string>>(new Set());
    const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [saveError, setSaveError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!testId) {
            return;
        }

        Promise.all([
            practiceTestService.getOne(testId),
            testAttemptService.startOrResume(testId),
        ])
            .then(([fetchedTest, fetchedAttempt]) => {
                setTest(fetchedTest);
                setAttemptId(fetchedAttempt.id);
                setCurrentModuleIndex(fetchedAttempt.currentModuleIndex);
                setAnswers(
                    Object.fromEntries(
                        fetchedAttempt.answers.map((answer) => [
                            answer.questionId,
                            answer.selectedChoiceId,
                        ])
                    )
                );
            })
            .catch(() => {
                setError('Error loading the test. Try again later.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [testId]);

    // Once the current module is finished, hold intersitial for a bit and then transition to next module
    useEffect(() => {
        if (!isTransitioning) {
            return;
        }

        const timer = setTimeout(() => {
            setCurrentModuleIndex((index) => index + 1);
            setCurrentQuestionIndex(0);
            setIsNavigatorOpen(false);
            setIsTransitioning(false);
        }, MODULE_TRANSITION_MS);

        return () => clearTimeout(timer);
    }, [isTransitioning]);

    const modules = useMemo(() => (test ? flattenModules(test) : []), [test]);

    // Mark the question currently on screen as visited
    useEffect(() => {
        const question = modules[currentModuleIndex]?.questions[currentQuestionIndex];

        if (!question) {
            return;
        }

        setVisitedQuestionIds((prev) => {
            if (prev.has(question.id)) {
                return prev;
            }

            const next = new Set(prev);
            next.add(question.id);

            return next;
        });
    }, [modules, currentModuleIndex, currentQuestionIndex]);

    const handleSelect = (questionId: string, choiceId: string) => {
        if (!attemptId) {
            return;
        }

        setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
        setSaveError('');

        testAttemptService
            .upsertAnswer(attemptId, questionId, choiceId)
            .catch(() => {
                setSaveError("We couldn't save your answer. Check your connection.");
            });
    };

    const handleNavigate = (index: number) => {
        if (index < 0 || index >= modules[currentModuleIndex].questions.length) {
            return;
        }

        setCurrentQuestionIndex(index);
    };

    const handleNavigatorSelect = (questionIdx: number) => {
        handleNavigate(questionIdx);
        setIsNavigatorOpen(false);
    };

    const finishTest = () => {
        if (!attemptId) {
            return;
        }

        setIsSubmitting(true);
        setSaveError('');

        testAttemptService
            .submit(attemptId)
            .then(() => {
                navigate(`/practice-tests/${testId}/results/${attemptId}`);
            })
            .catch(() => {
                setSaveError("We couldn't submit the test. Try again.");
                setIsSubmitting(false);
            });
    };

    const handleFinishModule = () => {
        if (!attemptId) {
            return;
        }

        const isLastModule = currentModuleIndex === modules.length - 1;

        if (isLastModule) {
            finishTest();
            return;
        }

        setSaveError('');
        setIsTransitioning(true);

        testAttemptService.advanceModule(attemptId).catch(() => {
            setIsTransitioning(false);
            setSaveError("We couldn't move to the next module. Try again.");
        });
    };

    if (isLoading) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-6">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#2f61c9]" />
            </section>
        );
    }

    if (error || !test || !attemptId) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-6">
                <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-800">
                    <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold">
                        We couldn't load the test
                    </h2>
                    <p className="mb-6 font-semibold">{error || 'Please try again later.'}</p>
                    <Link
                        to="/practice-tests"
                        className="inline-flex rounded-xl bg-[#13385A] px-5 py-2.5 font-bold text-white"
                    >
                        Back to practice tests
                    </Link>
                </div>
            </section>
        );
    }

    if (isTransitioning) {
        return <ModuleCompletionInterstitial />;
    }

    const currentModule = modules[currentModuleIndex];
    const moduleQuestions = currentModule.questions;
    const question = moduleQuestions[currentQuestionIndex];
    const selectedChoiceId = answers[question.id] ?? null;

    const isLastQuestion = currentQuestionIndex === moduleQuestions.length - 1;
    const isLastModule = currentModuleIndex === modules.length - 1;

    const sectionLabel = SECTION_LABELS[currentModule.sectionName];
    const moduleLabel = `Module ${currentModule.position}`;
    const questionStatuses: QuestionStatus[] = moduleQuestions.map((moduleQuestion, index) => {
        if (index === currentQuestionIndex) {
            return 'current';
        }

        if (answers[moduleQuestion.id]) {
            return 'answered';
        }

        if (visitedQuestionIds.has(moduleQuestion.id)) {
            return 'skipped';
        }

        return 'unreached';
    });

    return (
        <section className="relative flex h-screen flex-col overflow-hidden bg-[#f4f7fb]">
            <TestHeader
                title={test.title}
                sectionLabel={sectionLabel}
                moduleLabel={moduleLabel}
            />

            {saveError && (
                <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center text-sm font-semibold text-amber-800 sm:px-10">
                    {saveError}
                </div>
            )}

            <div className="min-h-0 flex-1">
                <Question
                    question={question}
                    sectionName={currentModule.sectionName}
                    selectedChoiceId={selectedChoiceId}
                    onSelect={(choiceId) => handleSelect(question.id, choiceId)}
                />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:px-10">
                <button
                    type="button"
                    onClick={() => handleNavigate(currentQuestionIndex - 1)}
                    disabled={currentQuestionIndex === 0}
                    className="rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-bold text-[#13385A] transition hover:border-blue-200 disabled:opacity-40"
                >
                    Back
                </button>

                <button
                    type="button"
                    onClick={() => setIsNavigatorOpen((open) => !open)}
                    aria-expanded={isNavigatorOpen}
                    className="rounded-xl border-2 border-slate-200 px-4 py-2.5 text-sm font-bold text-[#13385A] transition hover:border-blue-200"
                >
                    Question {currentQuestionIndex + 1} of {moduleQuestions.length}
                    <span className="ml-2 text-xs text-[#5A6B7B]">{isNavigatorOpen ? '▾' : '▴'}</span>
                </button>

                {isLastQuestion ? (
                    <button
                        type="button"
                        onClick={handleFinishModule}
                        disabled={isSubmitting}
                        className="rounded-xl bg-[#13385A] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e2b45] disabled:opacity-60"
                    >
                        {isLastModule
                            ? isSubmitting
                                ? 'Submitting…'
                                : 'Finish test'
                            : 'Next module'}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => handleNavigate(currentQuestionIndex + 1)}
                        className="rounded-xl bg-[#2f61c9] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#2450a8]"
                    >
                        Next
                    </button>
                )}
            </div>

            {isNavigatorOpen && (
                <QuestionNavigator
                    sectionLabel={sectionLabel}
                    moduleLabel={moduleLabel}
                    statuses={questionStatuses}
                    onSelect={handleNavigatorSelect}
                    onClose={() => setIsNavigatorOpen(false)}
                />
            )}
        </section>
    );
};

export default PracticeTest;
