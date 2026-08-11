import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import practiceTestService from '../../../services/practiceTestService';
import testAttemptService from '../../../services/testAttemptService';
import type { FullPracticeTest, Question as QuestionData, SectionName } from '../../../types/practiceTest';
import Question from './Question';
import TestHeader from './TestHeader';

interface FlatQuestion {
    question: QuestionData;
    sectionName: SectionName;
}

const SECTION_LABELS: Record<SectionName, string> = {
    reading_writing: 'Reading and Writing',
    math: 'Math',
};

const flattenQuestions = (test: FullPracticeTest): FlatQuestion[] => {
    const flatQuestions: FlatQuestion[] = [];

    for (const section of test.sections) {
        for (const module of section.modules) {
            for (const question of module.questions) {
                flatQuestions.push({ question, sectionName: section.name });
            }
        }
    }

    return flatQuestions;
};

const PracticeTest = () => {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();

    const [test, setTest] = useState<FullPracticeTest | null>(null);
    const [attemptId, setAttemptId] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<string, string | null>>({});
    const [currentIndex, setCurrentIndex] = useState(0);

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

    const questions = useMemo(() => (test ? flattenQuestions(test) : []), [test]);

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
        if (index < 0 || index >= questions.length) {
            return;
        }

        setCurrentIndex(index);
    };

    const handleSubmit = () => {
        if (!attemptId) {
            return;
        }

        setIsSubmitting(true);
        setSaveError('');

        testAttemptService
            .submit(attemptId)
            .then(() => {
                navigate('/');
            })
            .catch(() => {
                setSaveError("We couldn't submit the test. Try again.");
                setIsSubmitting(false);
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

    const { question, sectionName } = questions[currentIndex];
    const selectedChoiceId = answers[question.id] ?? null;

    return (
        <section className="flex h-screen flex-col overflow-hidden bg-[#f4f7fb]">
            <TestHeader
                title={test.title}
                sectionLabel={SECTION_LABELS[sectionName]}
                currentNumber={currentIndex + 1}
                totalQuestions={questions.length}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />

            {saveError && (
                <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-center text-sm font-semibold text-amber-800 sm:px-10">
                    {saveError}
                </div>
            )}

            <div className="min-h-0 flex-1">
                <Question
                    question={question}
                    sectionName={sectionName}
                    selectedChoiceId={selectedChoiceId}
                    onSelect={(choiceId) => handleSelect(question.id, choiceId)}
                />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:px-10">
                <button
                    type="button"
                    onClick={() => handleNavigate(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    className="rounded-xl border-2 border-slate-200 px-5 py-2.5 text-sm font-bold text-[#13385A] transition hover:border-blue-200 disabled:opacity-40"
                >
                    Back
                </button>

                <button
                    type="button"
                    onClick={() => handleNavigate(currentIndex + 1)}
                    disabled={currentIndex === questions.length - 1}
                    className="rounded-xl bg-[#2f61c9] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#2450a8] disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </section>
    );
};

export default PracticeTest;