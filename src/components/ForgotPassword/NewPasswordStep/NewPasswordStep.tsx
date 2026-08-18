import { useState } from 'react';
import { useForm } from 'react-hook-form';

import authService from '../../../services/authService';
import type { ResetPasswordData } from '../../../types/auth';

type NewPasswordStepProps = {
    email: string;
    code: string;
    onSuccess: () => void;
}

type NewPasswordFields = Pick<ResetPasswordData, 'newPassword' | 'confirmNewPassword'>;

const NewPasswordStep = ({ email, code, onSuccess }: NewPasswordStepProps) => {
     const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<NewPasswordFields>();

    const [submitError, setSubmitError] = useState('');

    const newPassword = watch('newPassword');

    const handleFormSubmit = async (data: NewPasswordFields) => {
        setSubmitError('');

        try {
            await authService.resetPassword({ email, code, ...data });
            onSuccess();
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
            <label className="block pt-1">
                <span className="mb-3 block text-sm font-extrabold text-[#1b1b1f]">
                    New password
                </span>
                <input
                    type="password"
                    className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-base font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="Create a new password"
                    {...register('newPassword', {
                        required: 'Password is required',
                        minLength: {
                            value: 8,
                            message: 'Password must be at least 8 characters',
                        },
                        maxLength: {
                            value: 72,
                            message: 'Password must be at most 72 characters',
                        },
                        pattern: {
                            value: /(?=.*\d)(?=.*[^A-Za-z0-9])/,
                            message: 'Password must contain at least 1 digit and 1 special character',
                        },
                    })}
                />
                {errors.newPassword && (
                    <span className="mt-2 block text-xs font-bold text-red-500">
                        {errors.newPassword.message}
                    </span>
                )}
            </label>

            <label className="block pt-1">
                <span className="mb-3 block text-sm font-extrabold text-[#1b1b1f]">
                    Confirm new password
                </span>
                <input
                    type="password"
                    className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-base font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="Confirm your new password"
                    {...register('confirmNewPassword', {
                        required: 'Confirm your new password',
                        validate: (value) => value === newPassword || 'Passwords do not match',
                    })}
                />
                {errors.confirmNewPassword && (
                    <span className="mt-2 block text-xs font-bold text-red-500">
                        {errors.confirmNewPassword.message}
                    </span>
                )}
            </label>

            {submitError && (
                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                    {submitError}
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="my-9 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2f61c9] px-10 text-base font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:bg-[#8da8df]"
            >
                {isSubmitting ? 'Resetting password...' : 'Reset password'}
            </button>
        </form>
    );
};

export default NewPasswordStep;