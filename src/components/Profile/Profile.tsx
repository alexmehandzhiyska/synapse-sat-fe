import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import userService from '../../services/userService';
import testAttemptService from '../../services/testAttemptService';
import type { UserProfile } from '../../types/auth';
import type { TestResult } from '../../types/testAttempt';
import { SECTION_LABELS } from '../PracticeTests/ScoreReport/labels';

import EditProfileForm from './EditProfileForm/EditProfileForm';
import ScoreTrendChart from './ScoreTrendChart/ScoreTrendChart';
import SectionPerformanceChart from './SectionPerformanceChart/SectionPerformanceChart';

const profileFields: { label: string; value: (profile: UserProfile) => string | null }[] = [
    { label: 'First name', value: (profile) => profile.firstName },
    { label: 'Last name', value: (profile) => profile.lastName },
    { label: 'Email address', value: (profile) => profile.email },
    { label: 'Country', value: (profile) => profile.country },
    { label: 'City', value: (profile) => profile.city },
    { label: 'School', value: (profile) => profile.school },
];

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [isLoadingResults, setIsLoadingResults] = useState(true);
    const [resultsError, setResultsError] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login');
            return;
        }

        userService
            .getProfile()
            .then((data) => {
                setProfile(data);
            })
            .catch(() => {
                setError('Error loading your profile. Try again later');
            })
            .finally(() => {
                setIsLoading(false);
            });

        testAttemptService
            .getAllCompleted()
            .then((data) => {
                setTestResults(data);
            })
            .catch(() => {
                setResultsError('Error loading your test results. Try again later');
            })
            .finally(() => {
                setIsLoadingResults(false);
            });
    }, [navigate]);

    const bestScore = testResults.length > 0
        ? Math.max(...testResults.map((result) => result.totalScaled))
        : 0;
        
    const latestScore = testResults.length > 0 
        ? testResults[0].totalScaled 
        : 0;

    const averageScore = testResults.length > 0
        ? Math.round(testResults.reduce((sum, result) => sum + result.totalScaled, 0) / testResults.length)
        : 0;

    const trend = testResults.length > 1
        ? Math.round(((latestScore - testResults[1].totalScaled) / testResults[1].totalScaled) * 100)
        : null;

    const summaryStats = [
        { label: 'Best score', value: String(bestScore), valueClassName: 'text-[#13385A]' },
        { label: 'Latest score', value: String(latestScore), valueClassName: 'text-[#13385A]' },
        { label: 'Average score', value: String(averageScore), valueClassName: 'text-[#13385A]' },
        {
            label: 'Trend',
            value: trend === null ? '—' : `${trend > 0 ? '+' : ''}${trend}%`,
            valueClassName:
                trend === null || trend === 0
                    ? 'text-[#13385A]'
                    : trend > 0
                        ? 'text-emerald-600'
                        : 'text-red-600',
        },
    ];

    return (
        <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-5xl">
                <div className="mb-9">
                    <h1 className="mb-3 font-['Space_Grotesk'] text-4xl font-extrabold leading-tight text-[#13385A] sm:text-5xl">
                        Profile
                    </h1>
                </div>

                {isLoading && (
                    <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
                )}

                {!isLoading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-800">
                        <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold">
                            We couldn't load your profile
                        </h2>
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                {!isLoading && !error && profile && !isEditing && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_24px_rgba(19,56,90,0.06)] sm:p-10">
                        <dl className="grid gap-6 sm:grid-cols-2">
                            {profileFields.map((field) => (
                                <div key={field.label} className="border-l-4 border-[#2f61c9] px-4 py-1">
                                    <dt className="mb-1 text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                                        {field.label}
                                    </dt>
                                    <dd className="font-['Space_Grotesk'] text-lg font-bold text-[#13385A]">
                                        {field.value(profile) || (
                                            <span className="font-sans text-base font-semibold text-[#a1a1aa]">
                                                Not provided
                                            </span>
                                        )}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="mt-8 flex h-12 items-center justify-center rounded-2xl bg-[#2f61c9] px-5 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8]"
                        >
                            Edit profile
                        </button>
                    </div>
                )}

                {!isLoading && !error && profile && isEditing && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_24px_rgba(19,56,90,0.06)] sm:p-10">
                        <EditProfileForm
                            profile={profile}
                            onSuccess={(updatedProfile) => {
                                setProfile(updatedProfile);
                                setIsEditing(false);
                            }}
                            onCancel={() => setIsEditing(false)}
                        />
                    </div>
                )}

                <div className="mt-10">
                    <h2 className="mb-4 font-['Space_Grotesk'] text-2xl font-extrabold text-[#13385A]">
                        Test results
                    </h2>

                    {isLoadingResults && (
                        <div className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />
                    )}

                    {!isLoadingResults && !resultsError && testResults.length > 0 && (
                        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {summaryStats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
                                >
                                    <p className="text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                                        {stat.label}
                                    </p>
                                    <p className={`mt-1 font-['Space_Grotesk'] text-2xl font-extrabold ${stat.valueClassName}`}>
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoadingResults && !resultsError && testResults.length > 0 && (
                        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <ScoreTrendChart testResults={testResults} />
                            <SectionPerformanceChart testResults={testResults} />
                        </div>
                    )}

                    {!isLoadingResults && resultsError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-800">
                            <h3 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold">
                                We couldn't load your test results
                            </h3>
                            <p className="font-semibold">{resultsError}</p>
                        </div>
                    )}

                    {!isLoadingResults && !resultsError && testResults.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                            <p className="font-semibold text-[#5A6B7B]">
                                You haven't completed any practice tests yet.
                            </p>
                        </div>
                    )}

                    {!isLoadingResults && !resultsError && testResults.length > 0 && (
                        <div className="space-y-4">
                            {testResults.map((result) => (
                                <Link
                                    key={result.id}
                                    to={`/practice-tests/${result.testId}/results/${result.id}`}
                                    className="block rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm transition duration-300 hover:border-blue-200 sm:px-8 sm:py-5"
                                >
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h3 className="font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                                                {result.testTitle}
                                            </h3>
                                            <p className="mt-1 text-sm font-semibold text-[#5A6B7B]">
                                                Completed {new Date(result.completedAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            {result.sections.map((section) => (
                                                <div key={section.name} className="text-center">
                                                    <p className="text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                                                        {SECTION_LABELS[section.name]}
                                                    </p>
                                                    <p className="mt-1 font-['Space_Grotesk'] text-xl font-extrabold text-[#2f61c9]">
                                                        {section.scaled}
                                                    </p>
                                                </div>
                                            ))}

                                            <div className="border-l border-slate-200 pl-6 text-center">
                                                <p className="text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                                                    Total
                                                </p>
                                                <p className="mt-1 font-['Space_Grotesk'] text-2xl font-extrabold text-[#13385A]">
                                                    {result.totalScaled}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Profile;