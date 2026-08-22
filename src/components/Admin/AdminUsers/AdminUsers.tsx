import { useEffect, useState } from 'react';

import adminService from '../../../services/adminService';
import type { AdminUser } from '../../../types/auth';
import UserRow from './UserRow';

const PAGE_SIZE = 20;

const AdminUsers = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

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

    const totalPages = Math.ceil(users.length / PAGE_SIZE);
    const pageUsers = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
                    <>
                        <div className="space-y-4">
                            {pageUsers.map((user) => (
                                <UserRow key={user.id} user={user} onUpdated={handleUserUpdated} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((page) => page - 1)}
                                    disabled={currentPage === 1}
                                    className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-bold text-[#1b1b1f] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                <span className="text-sm font-semibold text-[#5A6B7B]">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((page) => page + 1)}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-bold text-[#1b1b1f] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default AdminUsers;