import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import authService from '../../services/authService';
import practiceTestService from '../../services/practiceTestService';
import type { PracticeTest } from '../../types/practiceTest';
import ConfirmModal from '../common/ConfirmModal/ConfirmModal';

const PracticeTestsList = () => {
    const isTeacher = authService.getCurrentUser()?.role === 'teacher';
    const isStudent = authService.getCurrentUser()?.role === 'student';
    const [tests, setTests] = useState<PracticeTest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingTestId, setDeletingTestId] = useState<string | null>(null);
    const [testPendingDeletion, setTestPendingDeletion] = useState<PracticeTest | null>(null);

    useEffect(() => {
        practiceTestService
            .getAll()
            .then((data) => {
                setTests(data);
            })
            .catch(() => {
                setError('Error loading practice tests. Try again later');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleDelete = async () => {
        if (!testPendingDeletion) {
            return;
        }

        setTestPendingDeletion(null);
        setError('');
        setDeletingTestId(testPendingDeletion.id);

        try {
            await practiceTestService.remove(testPendingDeletion.id);
            setTests((prev) => prev.filter((item) => item.id !== testPendingDeletion.id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setDeletingTestId(null);
        }
    };

    return (
        <>
            <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-3xl">
                            <h1 className="mb-3 font-['Space_Grotesk'] text-4xl font-extrabold leading-tight text-[#13385A] sm:text-5xl">
                                Practice tests
                            </h1>
                            <p className="text-lg font-semibold leading-8 text-[#5A6B7B]">
                                Build confidence with full digital SAT practice in Reading and Writing and Math.
                            </p>
                        </div>
    
                        {isTeacher && (
                            <Link
                                to="/practice-tests/add"
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#2f61c9] px-6 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8]"
                            >
                                Add practice test
                            </Link>
                        )}
    
                        {isStudent && (
                            <Link
                                to="/practice-tests/custom-packet"
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#2f61c9] px-6 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8]"
                            >
                                Build custom packet
                            </Link>
                        )}
                    </div>
    
                    {isLoading && (
                        <div className="space-y-10" aria-label="Loading practice tests">
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white"
                                />
                            ))}
                        </div>
                    )}
    
                    {!isLoading && error && tests.length === 0 && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-800">
                            <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold">
                                We couldn't load the tests
                            </h2>
                            <p className="font-semibold">{error}</p>
                        </div>
                    )}
    
                    {!isLoading && !error && tests.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                            <h2 className="mb-3 font-['Space_Grotesk'] text-2xl font-extrabold text-[#1b1b1f]">
                                No practice tests yet
                            </h2>
                            <p className="font-semibold text-[#5A6B7B]">
                                New tests will appear here when they're available.
                            </p>
                        </div>
                    )}
    
                    {!isLoading && error && tests.length > 0 && (
                        <p className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                            {error}
                        </p>
                    )}
    
                    {!isLoading && tests.length > 0 && (
                        <div className="space-y-8">
                            {tests.map((test) => {
                                return (
                                    <article
                                        key={test.id}
                                        className="group flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(19,56,90,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_14px_34px_rgba(19,56,90,0.1)]"
                                    >
                                        <div className="min-w-60 flex-1 border-l-4 border-[#2f61c9] px-4 py-2">
                                            <span className="mb-1 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                                                {test.type} · Digital SAT
                                            </span>
                                            <h2 className="font-['Space_Grotesk'] text-2xl font-extrabold leading-tight text-[#13385A]">
                                                {test.title}
                                            </h2>
                                        </div>
    
                                        <div className="ml-auto flex flex-wrap items-center justify-end gap-3 px-2">
                                            {isTeacher ? (
                                                <>
                                                    <Link
                                                        to={`/practice-tests/${test.id}/questions/add`}
                                                        className="inline-flex items-center rounded-xl bg-[#13385A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e2b45]"
                                                    >
                                                        Add questions
                                                    </Link>
                                                    <Link
                                                        to={`/practice-tests/${test.id}/review`}
                                                        className="inline-flex items-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-[#13385A] transition hover:bg-gray-50"
                                                    >
                                                        Review questions
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setTestPendingDeletion(test)}
                                                        disabled={deletingTestId === test.id}
                                                        className="inline-flex items-center rounded-xl border border-red-200 px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {deletingTestId === test.id ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </>
                                            ) : (
                                                <Link
                                                    to={`/practice-tests/${test.id}`}
                                                    className="inline-flex items-center rounded-xl bg-[#13385A] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0e2b45]"
                                                >
                                                    Start test
                                                </Link>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {testPendingDeletion && (
                <ConfirmModal
                    title="Delete practice test?"
                    message={`Delete "${testPendingDeletion.title}"? This also removes all of its questions and any student results for it.`}
                    cancelLabel="Cancel"
                    confirmLabel="Delete"
                    confirmVariant="danger"
                    onCancel={() => setTestPendingDeletion(null)}
                    onConfirm={handleDelete}
                />
            )}
        </>
    );
};

export default PracticeTestsList;