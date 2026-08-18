import { useState } from 'react';
import { useForm } from 'react-hook-form';
import authService from '../../services/authService';
import type { RegisterData } from '../../types/auth';

const Register = () => {
    const [submitError, setSubmitError] = useState('');
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>();

    const password = watch('password');

    const onSubmit = async (data: RegisterData) => {
        setSubmitError('');

        try {
            await authService.register(data);
            window.location.href = '/';
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Registration failed.');
        }
    };

    return (
        <section className="min-h-[calc(100vh-97px)] w-full bg-white px-8 py-6 sm:px-10 lg:px-16 lg:py-7 xl:px-20">
            <div className="mx-auto grid max-w-6xl items-center gap-9 lg:grid-cols-[1fr_0.9fr] xl:gap-12">
                <div>
                    <div className="mb-4 inline-flex items-center rounded-4xl bg-blue-100 px-4 py-2">
                        <span className="mr-5 h-1.25 w-1.25 rounded-[50%] bg-blue-900"></span>
                        <p className="text-sm text-blue-900">Start with a smarter SAT system</p>
                    </div>

                    <h1 className="mb-4 font-['Space_Grotesk'] text-3xl font-extrabold leading-tight text-[#13385A] xl:text-5xl">
                        Create an Account
                    </h1>

                    <p className="max-w-xl text-base font-medium leading-7 text-[#5A6B7B]">
                        Build a personal study path with diagnostic practice, adaptive study plan,
                        and clear score tracking from day one.
                    </p>
                </div>

                <div className="w-full max-w-140 justify-self-center rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_24px_70px_rgba(19,56,90,0.12)] md:p-8 lg:justify-self-end">
                    <div className="mb-5">
                        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.35em] text-[#2f61c9]">
                            Register
                        </p>
                        <h2 className="font-['Space_Grotesk'] text-2xl font-extrabold text-[#1b1b1f]">
                            Join SynapseSAT
                        </h2>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block pt-1">
                                <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                    First name <span className="text-red-500">*</span>
                                </span>
                                <input
                                    type="text"
                                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    placeholder="Pencho"
                                    {...register('firstName', {
                                        required: 'First name is required',
                                    })}
                                />
                                {errors.firstName && (
                                    <span className="mt-2 block text-xs font-bold text-red-500">
                                        {errors.firstName.message}
                                    </span>
                                )}
                            </label>

                            <label className="block pt-1">
                                <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                    Last name <span className="text-red-500">*</span>
                                </span>
                                <input
                                    type="text"
                                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-bold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    placeholder="Minchov"
                                    {...register('lastName', {
                                        required: 'Last name is required',
                                    })}
                                />
                                {errors.lastName && (
                                    <span className="mt-2 block text-xs font-bold text-red-500">
                                        {errors.lastName.message}
                                    </span>
                                )}
                            </label>
                        </div>

                        <label className="block pt-1">
                            <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                Email address <span className="text-red-500">*</span>
                            </span>
                            <input
                                type="email"
                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-bold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
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

                        <label className="block pt-1">
                            <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                Password <span className="text-red-500">*</span>
                            </span>
                            <input
                                type="password"
                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-bold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                placeholder="Create a password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters',
                                    },
                                })}
                            />
                            {errors.password && (
                                <span className="mt-2 block text-xs font-bold text-red-500">
                                    {errors.password.message}
                                </span>
                            )}
                        </label>

                        <label className="block pt-1">
                            <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                Confirm password <span className="text-red-500">*</span>
                            </span>
                            <input
                                type="password"
                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-bold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                placeholder="Confirm your password"
                                {...register('confirmPassword', {
                                    required: 'Confirm your password',
                                    validate: (value) => value === password || 'Passwords do not match',
                                })}
                            />
                            {errors.confirmPassword && (
                                <span className="mt-2 block text-xs font-bold text-red-500">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </label>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block pt-1">
                                <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                    Country
                                </span>
                                <input
                                    type="text"
                                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-bold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    placeholder="Bulgaria"
                                    {...register('country')}
                                />
                            </label>

                            <label className="block pt-1">
                                <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                    City
                                </span>
                                <input
                                    type="text"
                                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-bold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    placeholder="Sofia"
                                    {...register('city')}
                                />
                            </label>
                        </div>

                        <label className="block pt-1">
                            <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                School
                            </span>
                            <input
                                type="text"
                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-bold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                placeholder="Your school"
                                {...register('school')}
                            />
                        </label>

                        {submitError && (
                            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                                {submitError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="my-8 flex h-12 w-full items-center justify-center rounded-2xl bg-[#2f61c9] px-10 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:bg-[#8da8df]"
                        >
                            {isSubmitting ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="mt-3 text-center text-xs font-semibold text-[#71717a]">
                        Already have an account?{' '}
                        <a href="/login" className="font-extrabold text-[#2f61c9] hover:text-[#244fa8]">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Register;
