import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import lessonsService from '../../../services/lessonsService';
import type { DomainProgress, LessonProgressStatus } from '../../../types/lesson';
import { DOMAIN_LABELS } from '../../PracticeTests/ScoreReport/labels';
import { getYoutubeEmbedUrl } from '../getYoutubeEmbedUrl';

const statusStyles: Record<LessonProgressStatus, string> = {
    complete: 'border-emerald-200 bg-emerald-50',
    current: 'border-[#2f61c9] bg-blue-50',
    locked: 'border-slate-200 bg-slate-50 opacity-60',
};

const StudentCourseView = () => {
    const [domains, setDomains] = useState<DomainProgress[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedLessonIds, setExpandedLessonIds] = useState<Set<string>>(new Set());

    const handleToggleExpand = (lessonId: string) => {
        setExpandedLessonIds((prev) => {
            const next = new Set(prev);

            if (next.has(lessonId)) {
                next.delete(lessonId);
            } else {
                next.add(lessonId);
            }

            return next;
        });
    };

    const loadProgress = () => {
        lessonsService.getProgress()
            .then(setDomains)
            .catch(() => setError('Error loading your course. Try again later.'))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadProgress();
    }, []);

    const handleMarkComplete = async (lessonId: string) => {
        await lessonsService.completeLesson(lessonId);
        loadProgress();
    };

    if (isLoading) {
        return <p className="font-semibold text-[#5A6B7B]">Loading your course...</p>;
    }

    if (error) {
        return <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>;
    }

    if (domains.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <h2 className="mb-2 font-['Space_Grotesk'] text-2xl font-extrabold text-[#1b1b1f]">
                    No lessons yet
                </h2>
                <p className="font-semibold text-[#5A6B7B]">
                    Your personalized course will appear here once it's available.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="font-['Space_Grotesk'] text-4xl font-extrabold leading-tight text-[#13385A] sm:text-5xl">
                Your course
            </h1>
            <p className="text-lg font-semibold leading-8 text-[#5A6B7B]">
                A personalized course, sequenced by where you need the most work.
            </p>

            <div className="space-y-4">
                {domains.map((domainProgress) => (
                    <div key={domainProgress.domain} className={`rounded-2xl border-2 p-6 ${statusStyles[domainProgress.status]}`}>
                        <h3 className="font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                            {DOMAIN_LABELS[domainProgress.domain]}
                        </h3>

                        {domainProgress.status !== 'locked' && (
                            <div className="mt-4 space-y-4">
                                {domainProgress.lessons.map((lesson) => {
                                    const embedUrl = getYoutubeEmbedUrl(lesson.videoUrl);
                                    const isExpanded = expandedLessonIds.has(lesson.id);

                                    const markCompleteControl = lesson.isWatched ? (
                                        <span className="text-xs font-bold text-emerald-600">Watched</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleMarkComplete(lesson.id);
                                            }}
                                            className="rounded-xl border-2 border-slate-200 px-4 py-2 text-xs font-bold text-[#13385A] transition hover:border-blue-200"
                                        >
                                            Mark complete
                                        </button>
                                    );

                                    return (
                                        <div key={lesson.id} className="space-y-3 rounded-xl bg-white p-4">
                                            {embedUrl ? (
                                                <div
                                                    role="button"
                                                    tabIndex={0}
                                                    onClick={() => handleToggleExpand(lesson.id)}
                                                    onKeyDown={(event) => {
                                                        if (event.key === 'Enter' || event.key === ' ') {
                                                            handleToggleExpand(lesson.id);
                                                        }
                                                    }}
                                                    className="flex flex-wrap cursor-pointer items-center justify-between gap-3"
                                                >
                                                    <p className="text-sm font-bold text-[#2f61c9]">
                                                        {lesson.title} {isExpanded ? '▾' : '▸'}
                                                    </p>
                                                    {markCompleteControl}
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <a
                                                        href={lesson.videoUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sm font-bold text-[#2f61c9] hover:text-[#244fa8]"
                                                    >
                                                        {lesson.title} ↗
                                                    </a>
                                                    {markCompleteControl}
                                                </div>
                                            )}

                                            {embedUrl && isExpanded && (
                                                <div className="aspect-video w-full overflow-hidden rounded-lg">
                                                    <iframe
                                                        src={embedUrl}
                                                        title={lesson.title}
                                                        className="h-full w-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {domainProgress.checkInTestId && (
                                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4">
                                        <span className="text-sm font-bold text-[#13385A]">Check-in test</span>
                                        {domainProgress.isCheckInComplete ? (
                                            <span className="text-xs font-bold text-emerald-600">Completed</span>
                                        ) : (
                                            <Link
                                                to={`/practice-tests/${domainProgress.checkInTestId}`}
                                                className="rounded-xl border-2 border-slate-200 px-4 py-2 text-xs font-bold text-[#13385A] transition hover:border-blue-200"
                                            >
                                                Take check-in test
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentCourseView;