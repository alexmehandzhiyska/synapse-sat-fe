import { useEffect, useState } from 'react';

import lessonsService from '../../services/lessonsService';
import type { Lesson } from '../../types/lesson';
import type { Domain } from '../../types/practiceTest';
import { DOMAINS_BY_SECTION } from '../PracticeTests/AddQuestion/domains';
import { DOMAIN_LABELS } from '../PracticeTests/ScoreReport/labels';
import AddLessonForm from './AddLessonForm/AddLessonForm';

const ALL_DOMAINS: Domain[] = [
    ...DOMAINS_BY_SECTION.reading_writing,
    ...DOMAINS_BY_SECTION.math,
];

const LessonsList = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadLessons = () => {
        lessonsService.getAll()
            .then(setLessons)
            .catch(() => setError('Error loading lessons. Try again later.'))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        loadLessons();
    }, []);

    return (
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

                                <ul className="mt-3 space-y-1">
                                    {domainLessons.map((lesson) => (
                                        <li key={lesson.id} className="text-sm font-semibold text-[#1b1b1f]">
                                            {lesson.title}
                                        </li>
                                    ))}
                                </ul>

                                <AddLessonForm domain={domain} onCreated={loadLessons} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default LessonsList;