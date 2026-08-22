import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import notebookService from '../../services/notebookService';
import type { NotebookEntry } from '../../types/notebook';
import NotebookEntryCard from './NotebookEntryCard';

const Notebook = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState<NotebookEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login');
            return;
        }

        notebookService
            .getAll()
            .then(setEntries)
            .catch(() => {
                setError('Error loading your notebook. Try again later');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [navigate]);

    const handleEntryUpdated = (updatedEntry: NotebookEntry) => {
        setEntries((prev) => prev.map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry)));
    };

    const handleEntryDeleted = (entryId: string) => {
        setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    };

    return (
        <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-4xl">
                <div className="mb-9">
                    <h1 className="mb-3 font-['Space_Grotesk'] text-4xl font-extrabold leading-tight text-[#13385A] sm:text-5xl">
                        Kolb's Notebook
                    </h1>
                    <p className="text-lg font-semibold leading-8 text-[#5A6B7B]">
                        Your reflections on questions you got wrong or weren't confident in.
                    </p>
                </div>

                {isLoading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white"
                            />
                        ))}
                    </div>
                )}

                {!isLoading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-800">
                        <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold">
                            We couldn't load your notebook
                        </h2>
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                {!isLoading && !error && entries.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                        <h2 className="mb-3 font-['Space_Grotesk'] text-2xl font-extrabold text-[#1b1b1f]">
                            Your notebook is empty
                        </h2>
                        <p className="font-semibold text-[#5A6B7B]">
                            After a test, click a question in your score report to reflect on it and add it here.
                        </p>
                    </div>
                )}

                {!isLoading && !error && entries.length > 0 && (
                    <div className="space-y-4">
                        {entries.map((entry) => (
                            <NotebookEntryCard
                                key={entry.id}
                                entry={entry}
                                onUpdated={handleEntryUpdated}
                                onDeleted={handleEntryDeleted}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Notebook;