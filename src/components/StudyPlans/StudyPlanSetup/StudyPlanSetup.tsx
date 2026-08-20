import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import studyPlanService from '../../../services/studyPlanService';
import GoalScoreStep from './GoalScoreStep/GoalScoreStep';
import PrepStartDateStep from './PrepStartDateStep/PrepStartDateStep';
import StepProgressBar from './StepProgressBar/StepProgressBar';
import TestDateStep from './TestDateStep/TestDateStep';

const TOTAL_STEPS = 3;

const StudyPlanSetup = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [goalScore, setGoalScore] = useState<number | null>(null);
    const [testDate, setTestDate] = useState('');
    const [prepStartDate, setPrepStartDate] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleFinish = async () => {
        if (!goalScore) {
            return;
        }

        setSubmitError('');
        setIsSubmitting(true);

        try {
            await studyPlanService.upsert({ goalScore, testDate, prepStartDate });
            navigate('/practice-tests');
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-6 py-12">
            <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_8px_24px_rgba(19,56,90,0.06)] sm:p-10">
                <div className="mb-8">
                    <StepProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
                </div>

                {step === 1 && (
                    <GoalScoreStep
                        value={goalScore}
                        onChange={setGoalScore}
                        onNext={() => setStep(2)}
                    />
                )}

                {step === 2 && (
                    <TestDateStep
                        value={testDate}
                        onChange={setTestDate}
                        onNext={() => setStep(3)}
                        onBack={() => setStep(1)}
                    />
                )}

                {step === 3 && (
                    <PrepStartDateStep
                        value={prepStartDate}
                        testDate={testDate}
                        onChange={setPrepStartDate}
                        onFinish={handleFinish}
                        onBack={() => setStep(2)}
                        isSubmitting={isSubmitting}
                        submitError={submitError}
                    />
                )}
            </div>
        </section>
    );
};

export default StudyPlanSetup;