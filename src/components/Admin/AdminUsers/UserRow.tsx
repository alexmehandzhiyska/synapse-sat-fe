import { useState } from 'react';

import adminService from '../../../services/adminService';
import type { AdminUser } from '../../../types/auth';
import UserEditForm from './UserEditForm';
import { ROLE_LABELS } from './roles';

type UserRowProps = {
    user: AdminUser;
    onUpdated: (user: AdminUser) => void;
}

const UserRow = ({ user, onUpdated }: UserRowProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isAdmin = user.role === 'admin';

    const handleDeactivate = async () => {
        if (!window.confirm(`Deactivate ${user.firstName} ${user.lastName}'s account? They will no longer be able to log in.`)) {
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const updated = await adminService.deactivateUser(user.id);
            onUpdated(updated);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivate = async () => {
        setError('');
        setIsLoading(true);

        try {
            const updated = await adminService.activateUser(user.id);
            onUpdated(updated);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isEditing) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(19,56,90,0.06)]">
                <UserEditForm
                    user={user}
                    onSave={(updated) => {
                        onUpdated(updated);
                        setIsEditing(false);
                    }}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(19,56,90,0.06)] sm:grid-cols-[minmax(0,1fr)_16rem_13rem]">
            <div className="min-w-0">
                <h3 className="font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                    {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm font-semibold text-[#5A6B7B]">{user.email}</p>
            </div>

            <div className="flex items-center gap-2">
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-[#13385A]">
                    {ROLE_LABELS[user.role]}
                </span>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-widest ${
                        user.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                    }`}
                >
                    {user.isActive ? 'Active' : 'Deactivated'}
                </span>
            </div>

            {!isAdmin && (
                <div className="flex items-center gap-3 sm:justify-end">
                    {user.isActive ? (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-bold text-[#1b1b1f] transition hover:bg-gray-50"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={handleDeactivate}
                                disabled={isLoading}
                                className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 px-4 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? 'Deactivating...' : 'Deactivate'}
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={handleActivate}
                            disabled={isLoading}
                            className="inline-flex h-10 items-center justify-center rounded-xl border border-emerald-200 px-4 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading ? 'Activating...' : 'Activate'}
                        </button>
                    )}
                </div>
            )}

            {error && (
                <p className="text-xs font-bold text-red-500 sm:col-span-3">{error}</p>
            )}
        </div>
    );
};

export default UserRow;