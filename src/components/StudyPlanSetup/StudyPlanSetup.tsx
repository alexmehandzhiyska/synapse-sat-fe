import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import studyPlanService from '../../services/studyPlanService';
import GoalScoreStep from './GoalScoreStep/GoalScoreStep';

const StudyPlanSetup = () => {
    const navigate = useNavigate();

    const [goalScore, setGoalScore] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleNext = async () => {
        if (!goalScore) {
            return;
        }

        setSubmitError('');
        setIsSubmitting(true);

        try {
            await studyPlanService.upsert({ goalScore });
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
                <div className="mb-8 flex justify-end">
                    <button
                        type="button"
                        onClick={() => navigate('/practice-tests')}
                        className="text-xs font-bold text-[#5A6B7B] transition hover:text-[#13385A]"
                    >
                        Skip
                    </button>
                </div>

                <GoalScoreStep
                    value={goalScore}
                    onChange={setGoalScore}
                    onNext={handleNext}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                />
            </div>
        </section>
    );
};

export default StudyPlanSetup;