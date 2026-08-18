import { useState } from 'react';
import { useForm } from 'react-hook-form';

import authService from '../../../services/authService';
import type { ForgotPasswordData } from '../../../types/auth';

type RequestCodeStepProps = {
    onSuccess: (email: string) => void;
}

const RequestCodeStep = ({ onSuccess }: RequestCodeStepProps) => {
    const [submitError, setSubmitError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordData>();

    const handleFormSubmit = async (data: ForgotPasswordData) => {
        setSubmitError('');

        try {
            await authService.forgotPassword(data);
            onSuccess(data.email);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
            <label className="block pt-1">
                <span className="mb-3 block text-sm font-extrabold text-[#1b1b1f]">
                    Email address
                </span>
                <input
                    type="email"
                    className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-base font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="pen4o@gmail.com"
                    {...register('email', {
                        required: 'Email address is required',
                    })}
                />
                {errors.email && (
                    <span className="mt-2 block text-xs font-bold text-red-500">
                        {errors.email.message}
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
                {isSubmitting ? 'Sending code...' : 'Send verification code'}
            </button>
        </form>
    );
};

export default RequestCodeStep;
