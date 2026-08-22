import { useEffect, useState } from 'react';

import adminService from '../../../services/adminService';
import type { AdminUser } from '../../../types/auth';
import UserRow from './UserRow';

const AdminUsers = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        adminService
            .getAllUsers()
            .then(setUsers)
            .catch(() => {
                setError('Error loading accounts. Try again later');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleUserUpdated = (updatedUser: AdminUser) => {
        setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    };

    return (
        <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-5xl">
                <div className="mb-9">
                    <h1 className="mb-3 font-['Space_Grotesk'] text-4xl font-extrabold leading-tight text-[#13385A] sm:text-5xl">
                        Accounts
                    </h1>
                </div>

                {isLoading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white"
                            />
                        ))}
                    </div>
                )}

                {!isLoading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-800">
                        <h2 className="mb-2 font-['Space_Grotesk'] text-xl font-extrabold">
                            We couldn't load accounts
                        </h2>
                        <p className="font-semibold">{error}</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <div className="space-y-4">
                        {users.map((user) => (
                            <UserRow key={user.id} user={user} onUpdated={handleUserUpdated} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AdminUsers;