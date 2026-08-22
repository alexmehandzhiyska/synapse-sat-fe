import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import practiceTestService from '../../../services/practiceTestService';
import type { FullPracticeTest, Question } from '../../../types/practiceTest';
import { SECTION_LABELS } from '../ScoreReport/labels';
import QuestionCard from './QuestionCard';

const replaceQuestionInTest = (test: FullPracticeTest, updatedQuestion: Question): FullPracticeTest => ({
    ...test,
    sections: test.sections.map((section) => ({
        ...section,
        modules: section.modules.map((module) => ({
            ...module,
            questions: module.questions.map((question) =>
                question.id === updatedQuestion.id ? updatedQuestion : question,
            ),
        })),
    })),
});

const ReviewQuestions = () => {
    const { testId } = useParams<{ testId: string }>();
    const [test, setTest] = useState<FullPracticeTest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!testId) {
            return;
        }

        practiceTestService
            .getOne(testId)
            .then(setTest)
            .catch(() => {
                setError('Error loading the practice test. Try again later');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [testId]);

    const handleQuestionUpdated = (updatedQuestion: Question) => {
        setTest((prev) => (prev ? replaceQuestionInTest(prev, updatedQuestion) : prev));
    };

    return (
        <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-4xl">
                <div className="mb-9">
                    <h1 className="mb-3 font-['Space_Grotesk'] text-4xl font-extrabold leading-tight text-[#13385A] sm:text-5xl">
                        Review questions
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

                {!isLoading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-800">
                        <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold">
                            We couldn't load the test
                        </h2>
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                {!isLoading && !error && test && (
                    <div className="space-y-10">
                        {test.sections.map((section) => (
                            <div key={section.id}>
                                <h2 className="mb-4 font-['Space_Grotesk'] text-2xl font-extrabold text-[#13385A]">
                                    {SECTION_LABELS[section.name]}
                                </h2>

                                {section.modules.map((module) => (
                                    <div key={module.id} className="mb-8">
                                        <h3 className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                                            Module {module.position}
                                        </h3>

                                        {module.questions.length === 0 && (
                                            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-[#5A6B7B]">
                                                No questions added yet.
                                            </p>
                                        )}

                                        <div className="space-y-4">
                                            {module.questions.map((question) => (
                                                <QuestionCard
                                                    key={question.id}
                                                    question={question}
                                                    sectionName={section.name}
                                                    onUpdated={handleQuestionUpdated}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ReviewQuestions;