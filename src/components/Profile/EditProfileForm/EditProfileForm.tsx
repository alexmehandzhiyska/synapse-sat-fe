import { useState } from 'react';
import { useForm } from 'react-hook-form';

import userService from '../../../services/userService';
import type { UpdateProfileData, UserProfile } from '../../../types/auth';

type EditProfileFormProps = {
    profile: UserProfile;
    onSuccess: (profile: UserProfile) => void;
    onCancel: () => void;
}

const EditProfileForm = ({ profile, onSuccess, onCancel }: EditProfileFormProps) => {
    const [submitError, setSubmitError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfileData>({
        defaultValues: {
            firstName: profile.firstName,
            lastName: profile.lastName,
            country: profile.country ?? '',
            city: profile.city ?? '',
            school: profile.school ?? '',
        },
    });

    const handleFormSubmit = async (data: UpdateProfileData) => {
        setSubmitError('');

        try {
            const updatedProfile = await userService.update(data);
            onSuccess(updatedProfile);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                        First name
                    </span>
                    <input
                        type="text"
                        className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                        {...register('firstName', {
                            required: 'First name is required',
                            maxLength: {
                                value: 100,
                                message: 'First name must be at most 100 characters',
                            },
                        })}
                    />
                    {errors.firstName && (
                        <span className="mt-2 block text-xs font-bold text-red-500">
                            {errors.firstName.message}
                        </span>
                    )}
                </label>

                <label className="block">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                        Last name
                    </span>
                    <input
                        type="text"
                        className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                        {...register('lastName', {
                            required: 'Last name is required',
                            maxLength: {
                                value: 100,
                                message: 'Last name must be at most 100 characters',
                            },
                        })}
                    />
                    {errors.lastName && (
                        <span className="mt-2 block text-xs font-bold text-red-500">
                            {errors.lastName.message}
                        </span>
                    )}
                </label>

                <label className="block">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                        Country
                    </span>
                    <input
                        type="text"
                        className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                        {...register('country')}
                    />
                </label>

                <label className="block">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                        City
                    </span>
                    <input
                        type="text"
                        className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                        {...register('city')}
                    />
                </label>

                <label className="block sm:col-span-2">
                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                        School
                    </span>
                    <input
                        type="text"
                        className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                        {...register('school')}
                    />
                </label>
            </div>

            {submitError && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                    {submitError}
                </p>
            )}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-12 items-center justify-center rounded-2xl bg-[#2f61c9] px-8 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:bg-[#8da8df]"
                >
                    {isSubmitting ? 'Saving...' : 'Save changes'}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="flex h-12 items-center justify-center rounded-2xl border border-gray-200 px-8 text-sm font-extrabold text-[#1b1b1f] transition hover:bg-gray-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default EditProfileForm;