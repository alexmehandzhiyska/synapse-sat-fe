import { useEffect, useState } from 'react';

import lessonsService from '../../services/lessonsService';
import type { Lesson } from '../../types/lesson';
import type { Domain } from '../../types/practiceTest';
import ConfirmModal from '../common/ConfirmModal/ConfirmModal';
import { DOMAINS_BY_SECTION } from '../PracticeTests/AddQuestion/domains';
import { DOMAIN_LABELS } from '../PracticeTests/ScoreReport/labels';
import AddLessonForm from './AddLessonForm/AddLessonForm';
import EditLessonForm from './EditLessonForm/EditLessonForm';
import LessonEmbed from './LessonEmbed/LessonEmbed';

const ALL_DOMAINS: Domain[] = [
    ...DOMAINS_BY_SECTION.reading_writing,
    ...DOMAINS_BY_SECTION.math,
];

const TeacherCourseView = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);
    const [lessonPendingDeletion, setLessonPendingDeletion] = useState<Lesson | null>(null);

    const loadLessons = () => {
        lessonsService.getAll()
            .then(setLessons)
            .catch(() => setError('Error loading lessons. Try again later.'))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadLessons();
    }, []);

    const handleDelete = async () => {
        if (!lessonPendingDeletion) {
            return;
        }

        setLessonPendingDeletion(null);
        setError('');
        setDeletingLessonId(lessonPendingDeletion.id);

        try {
            await lessonsService.deleteLesson(lessonPendingDeletion.id);
            setLessons((prev) => prev.filter((item) => item.id !== lessonPendingDeletion.id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setDeletingLessonId(null);
        }
    };

    return (
        <>
            <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
                <div className="mx-auto max-w-4xl space-y-8">
                    <div>
                        <h1 className="font-['Space_Grotesk'] text-4xl font-extrabold leading-tight text-[#13385A] sm:text-5xl">
                            Manage lessons
                        </h1>
                    </div>

                    {isLoading && <p className="font-semibold text-[#5A6B7B]">Loading...</p>}
                    {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}

                    <div className="space-y-6">
                        {ALL_DOMAINS.map((domain) => {
                            const domainLessons = lessons.filter((lesson) => lesson.domain === domain);

                            return (
                                <div key={domain} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h3 className="font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                                        {DOMAIN_LABELS[domain]}
                                    </h3>

                                    <div className="mt-3 mb-5">
                                        {domainLessons.map((lesson) => (
                                            editingLessonId === lesson.id ? (
                                                <EditLessonForm
                                                    key={lesson.id}
                                                    lesson={lesson}
                                                    onSaved={() => {
                                                        setEditingLessonId(null);
                                                        loadLessons();
                                                    }}
                                                    onCancel={() => setEditingLessonId(null)}
                                                />
                                            ) : (
                                                <LessonEmbed
                                                    key={lesson.id}
                                                    lesson={lesson}
                                                    rightContent={
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    setEditingLessonId(lesson.id);
                                                                }}
                                                                className="rounded-xl border-2 border-slate-200 px-4 py-2 text-xs font-bold text-[#13385A] transition hover:border-blue-200"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={deletingLessonId === lesson.id}
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    setLessonPendingDeletion(lesson);
                                                                }}
                                                                className="rounded-xl border-2 border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                                                            >
                                                                {deletingLessonId === lesson.id ? 'Deleting...' : 'Delete'}
                                                            </button>
                                                        </div>
                                                    }
                                                />
                                            )
                                        ))}
                                    </div>

                                    <AddLessonForm domain={domain} onCreated={loadLessons} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {lessonPendingDeletion && (
                <ConfirmModal
                    title="Delete lesson?"
                    message={`Delete "${lessonPendingDeletion.title}"? This can't be undone.`}
                    cancelLabel="Cancel"
                    confirmLabel="Delete"
                    confirmVariant="danger"
                    onCancel={() => setLessonPendingDeletion(null)}
                    onConfirm={handleDelete}
                />
            )}
        </>
    );
};

export default TeacherCourseView;