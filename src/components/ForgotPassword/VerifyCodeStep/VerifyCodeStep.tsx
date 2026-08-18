import { useState } from 'react';
import { useForm } from 'react-hook-form';

import authService from '../../../services/authService';
import type { VerifyResetCodeData } from '../../../types/auth';

type VerifyCodeStepProps = {
    email: string;
    onSuccess: (code: string) => void;
}

const VerifyCodeStep = ({ email, onSuccess }: VerifyCodeStepProps) => {
    const [submitError, setSubmitError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Pick<VerifyResetCodeData, 'code'>>();

    const handleFormSubmit = async (data: Pick<VerifyResetCodeData, 'code'>) => {
        setSubmitError('');

        try {
            await authService.verifyResetCode({ email, code: data.code });
            onSuccess(data.code);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
        }
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
            <p className="text-sm font-semibold text-[#5A6B7B]">
                We sent a 6-digit code to <span className="font-extrabold text-[#1b1b1f]">{email}</span>. Enter it below.
            </p>

            <label className="block pt-1">
                <span className="mb-3 block text-sm font-extrabold text-[#1b1b1f]">
                    Verification code
                </span>
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-base font-semibold tracking-[0.4em] text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="123456"
                    {...register('code', {
                        required: 'Verification code is required',
                        pattern: {
                            value: /^\d{6}$/,
                            message: 'Enter the 6-digit code',
                        },
                    })}
                />
                {errors.code && (
                    <span className="mt-2 block text-xs font-bold text-red-500">
                        {errors.code.message}
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
                {isSubmitting ? 'Verifying...' : 'Verify code'}
            </button>
        </form>
    );
};

export default VerifyCodeStep;
