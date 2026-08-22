import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

import adminService from '../../../services/adminService';
import type { AdminUser, UpdateUserData } from '../../../types/auth';
import { ROLE_OPTIONS } from './roles';

type UserEditFormProps = {
    user: AdminUser;
    onSave: (user: AdminUser) => void;
    onCancel: () => void;
}

const inputClassName = 'h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100';
const selectClassName = 'h-11 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-4 pr-10 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100';

const UserEditForm = ({ user, onSave, onCancel }: UserEditFormProps) => {
    const [submitError, setSubmitError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserData>({
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            country: user.country ?? '',
            city: user.city ?? '',
            school: user.school ?? '',
            role: user.role,
        },
    });

    const handleFormSubmit = async (data: UpdateUserData) => {
        setSubmitError('');

        try {
            const updated = await adminService.updateUser(user.id, data);
            onSave(updated);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                    <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                        First name
                    </span>
                    <input
                        type="text"
                        className={inputClassName}
                        {...register('firstName', { required: 'First name is required' })}
                    />
                    {errors.firstName && (
                        <span className="mt-1.5 block text-xs font-bold text-red-500">
                            {errors.firstName.message}
                        </span>
                    )}
                </label>

                <label className="block">
                    <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                        Last name
                    </span>
                    <input
                        type="text"
                        className={inputClassName}
                        {...register('lastName', { required: 'Last name is required' })}
                    />
                    {errors.lastName && (
                        <span className="mt-1.5 block text-xs font-bold text-red-500">
                            {errors.lastName.message}
                        </span>
                    )}
                </label>

                <label className="block">
                    <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                        Country
                    </span>
                    <input type="text" className={inputClassName} {...register('country')} />
                </label>

                <label className="block">
                    <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                        City
                    </span>
                    <input type="text" className={inputClassName} {...register('city')} />
                </label>

                <label className="block">
                    <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                        School
                    </span>
                    <input type="text" className={inputClassName} {...register('school')} />
                </label>

                <label className="block">
                    <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#2f61c9]">
                        Role
                    </span>
                    <div className="relative">
                        <select className={selectClassName} {...register('role', { required: true })}>
                            {ROLE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <FontAwesomeIcon
                            icon={faChevronDown}
                            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A6B7B]"
                        />
                    </div>
                </label>
            </div>

            {submitError && (
                <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600">
                    {submitError}
                </p>
            )}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-10 items-center justify-center rounded-xl bg-[#2f61c9] px-5 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:bg-[#8da8df]"
                >
                    {isSubmitting ? 'Saving...' : 'Save changes'}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="flex h-10 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-extrabold text-[#1b1b1f] transition hover:bg-gray-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default UserEditForm;