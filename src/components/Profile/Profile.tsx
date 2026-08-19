import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import userService from '../../services/userService';
import type { UserProfile } from '../../types/auth';

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
    }, [navigate]);

    return (
        <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-3xl">
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

                {!isLoading && !error && profile && (
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
                    </div>
                )}
            </div>
        </section>
    );
};

export default Profile;