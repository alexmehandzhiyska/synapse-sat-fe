import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import practiceTestService from '../../../services/practiceTestService';
import testAttemptService from '../../../services/testAttemptService';
import type { FullPracticeTest, PracticeTestType, Question as QuestionData, SectionName } from '../../../types/practiceTest';
import type { ModuleRoutes } from '../../../types/testAttempt';
import ConfirmModal from '../../common/ConfirmModal/ConfirmModal';
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

type FullTestType = 'standard' | 'diagnostic';

// Bluebook module time limits converted into seconds. The diagnostic - half the length => half the time
const MODULE_TIME_LIMITS: Record<FullTestType, Record<SectionName, number>> = {
    standard: { reading_writing: 32 * 60, math: 35 * 60 },
    diagnostic: { reading_writing: 16 * 60, math: 17.5 * 60 },
};

const TIME_SAVE_INTERVAL_MS = 15000;

// Only full tests are timed and have an easy and a hard module 2
const isFullTestType = (type: PracticeTestType): type is FullTestType => type === 'standard' || type === 'diagnostic';
const getModuleEndsAt = (secondsRemaining: number) => Date.now() + secondsRemaining * 1000;
const getSecondsUntil = (endsAt: number) => Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const flattenModules = (test: FullPracticeTest, moduleRoutes: ModuleRoutes): TestModule[] => {
    if (test.type === 'check_in') {
        // A check-in test has no modules - just one flat list of questions.
        const questions = test.sections.flatMap((section) => section.modules.flatMap((module) => module.questions));

        return [{
            sectionName: test.sections[0]?.name ?? 'reading_writing',
            position: 1,
            questions,
        }];
    }

    const modules: TestModule[] = [];

    for (const section of test.sections) {
        const route = moduleRoutes[section.name] ?? 'hard';

        for (const module of section.modules) {
            // Full tests skip the version of module 2 the student wasn't routed to
            if (isFullTestType(test.type) && module.position === 2 && module.variant !== route) {
                continue;
            }

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
    const [moduleRoutes, setModuleRoutes] = useState<ModuleRoutes>({});
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [visitedQuestionIds, setVisitedQuestionIds] = useState<Set<string>>(new Set());
    const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(0);
    const [moduleEndsAt, setModuleEndsAt] = useState<number | null>(null);

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
                setModuleRoutes(fetchedAttempt.moduleRoutes);
                
                // A check-in test is always one flat module
                const moduleIndex = fetchedTest.type === 'check_in' ? 0 : fetchedAttempt.currentModuleIndex;
                setCurrentModuleIndex(moduleIndex);

                if (isFullTestType(fetchedTest.type)) {
                    const sectionName = flattenModules(fetchedTest, fetchedAttempt.moduleRoutes)[moduleIndex].sectionName;
                    const startingSeconds = fetchedAttempt.moduleSecondsRemaining ?? MODULE_TIME_LIMITS[fetchedTest.type][sectionName];

                    setSecondsRemaining(startingSeconds);
                    setModuleEndsAt(getModuleEndsAt(startingSeconds));
                }

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

    const modules = useMemo(() => (test ? flattenModules(test, moduleRoutes) : []), [test, moduleRoutes]);
    const isTimed = test !== null && isFullTestType(test.type);

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

    const handleSelect = (questionId: string, choiceId: string | null) => {
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

    const handleExit = async () => {
        if (moduleEndsAt !== null && attemptId) {
            await testAttemptService.updateTimeRemaining(attemptId, getSecondsUntil(moduleEndsAt)).catch(() => {});
        }

        navigate('/practice-tests');
    };

    const resumeClock = () => {
        if (isTimed && secondsRemaining > 0) {
            setModuleEndsAt(getModuleEndsAt(secondsRemaining));
        }
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
                resumeClock();
            });
    };

    const handleFinishModule = () => {
        if (!attemptId) {
            return;
        }

        // Stop the clock while the module is being finished
        setModuleEndsAt(null);

        const isLastModule = currentModuleIndex === modules.length - 1;

        if (isLastModule) {
            finishTest();
            return;
        }

        setSaveError('');
        setIsTransitioning(true);

        // Once the current module is finished, hold intersitial for a bit and then transition to next module
        // The interstitial also stays until the backend says which module 2 the student was routed to
        Promise.all([testAttemptService.advanceModule(attemptId), wait(MODULE_TRANSITION_MS)])
            .then(([updatedAttempt]) => {
                setModuleRoutes(updatedAttempt.moduleRoutes);
                moveToNextModule();
            })
            .catch(() => {
                setIsTransitioning(false);
                setSaveError("We couldn't move to the next module. Try again.");
                resumeClock();
            });
    };

    const moveToNextModule = () => {
        const nextModuleIndex = currentModuleIndex + 1;
        setCurrentModuleIndex(nextModuleIndex);
        setCurrentQuestionIndex(0);
        setIsNavigatorOpen(false);
        setIsTransitioning(false);

        if (test && isFullTestType(test.type)) {
            const nextModuleSeconds = MODULE_TIME_LIMITS[test.type][modules[nextModuleIndex].sectionName];

            setSecondsRemaining(nextModuleSeconds);
            setModuleEndsAt(getModuleEndsAt(nextModuleSeconds));
        }
    };

    // Module ends on its own when the time runs out
    const handleTimeUp = useEffectEvent(() => {
        handleFinishModule();
    });

    // Count the module's time down every second
    useEffect(() => {
        if (moduleEndsAt === null) {
            return;
        }

        const interval = setInterval(() => {
            const nextSecondsRemaining = getSecondsUntil(moduleEndsAt);
            setSecondsRemaining(nextSecondsRemaining);

            if (nextSecondsRemaining === 0) {
                handleTimeUp();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [moduleEndsAt]);

    // Save the time left every 15 seconds, in case the student leaves without the Exit button (closing the tab, refreshing, etc.)
    useEffect(() => {
        if (moduleEndsAt === null || !attemptId) {
            return;
        }

        const interval = setInterval(() => {
            testAttemptService.updateTimeRemaining(attemptId, getSecondsUntil(moduleEndsAt)).catch(() => {});
        }, TIME_SAVE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [moduleEndsAt, attemptId]);

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
    const isLastModule = currentModuleIndex === modules.length - 1;

    if (moduleQuestions.length === 0) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-6">
                <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold text-[#1b1b1f]">
                        No questions yet
                    </h2>
                    <p className="mb-6 font-semibold text-[#5A6B7B]">
                        {test.type === 'check_in'
                            ? "This check-in doesn't have any questions yet."
                            : "This module doesn't have any questions yet."}
                    </p>
                    <button
                        type="button"
                        onClick={handleFinishModule}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center rounded-xl bg-[#13385A] px-5 py-2.5 font-bold text-white disabled:opacity-60"
                    >
                        {isLastModule
                            ? isSubmitting ? 'Submitting…' : 'Finish test'
                            : 'Next module'}
                    </button>
                </div>
            </section>
        );
    }

    const question = moduleQuestions[currentQuestionIndex];
    const selectedChoiceId = answers[question.id] ?? null;

    const isLastQuestion = currentQuestionIndex === moduleQuestions.length - 1;

    const sectionLabel = SECTION_LABELS[currentModule.sectionName];
    const moduleLabel = test.type === 'check_in' ? '' : `Module ${currentModule.position}`;
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
                secondsRemaining={isTimed ? secondsRemaining : undefined}
                onExit={() => setIsExitConfirmOpen(true)}
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

            {isExitConfirmOpen && (
                <ConfirmModal
                    title="Exit practice test?"
                    message="Your progress is saved. You can resume this test later from where you left off."
                    cancelLabel="Keep going"
                    confirmLabel="Exit test"
                    confirmVariant="danger"
                    onCancel={() => setIsExitConfirmOpen(false)}
                    onConfirm={handleExit}
                />
            )}
        </section>
    );
};

export default PracticeTest;