import { useState } from 'react';
import { useForm } from 'react-hook-form';

import authService from '../../services/authService';
import type { LoginData } from '../../types/auth';

const Login = () => {
    const [submitError, setSubmitError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginData>();

    const onSubmit = async (data: LoginData) => {
        setSubmitError('');

        try {
            await authService.login(data);
            window.location.href = '/';
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Login failed.');
        }
    };

    return (
        <section className="flex min-h-[calc(100vh-97px)] w-full items-center bg-white px-8 py-10 sm:px-10 lg:px-16 lg:py-12 xl:px-20">
            <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.95fr] xl:gap-14">
                <div>
                    <div className="mb-4 inline-flex items-center rounded-4xl bg-blue-100 px-4 py-2">
                        <span className="mr-5 h-1.25 w-1.25 rounded-[50%] bg-blue-900"></span>
                        <p className="text-sm text-blue-900">Continue your smarter SAT prep</p>
                    </div>

                    <h1 className="mb-4 font-['Space_Grotesk'] text-3xl font-extrabold leading-tight text-[#13385A] xl:text-5xl">
                        Welcome Back
                    </h1>

                    <p className="max-w-xl text-base font-medium leading-7 text-[#5A6B7B]">
                        Pick up where you left off with diagnostic results 
                        and your personal study plan ready to go.
                    </p>
                </div>

                <div className="w-full max-w-150 justify-self-center rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_24px_70px_rgba(19,56,90,0.12)] sm:p-10 lg:justify-self-end xl:p-12">
                    <div className="mb-8">
                        <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.35em] text-[#2f61c9]">
                            Login
                        </p>
                        <h2 className="font-['Space_Grotesk'] text-3xl font-extrabold text-[#1b1b1f]">
                            Sign in to SynapseSAT
                        </h2>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

                        <label className="block pt-1">
                            <span className="mb-3 block text-sm font-extrabold text-[#1b1b1f]">
                                Password
                            </span>
                            <input
                                type="password"
                                className="h-14 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-base font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                placeholder="Enter your password"
                                {...register('password', {
                                    required: 'Password is required',
                                })}
                            />
                            {errors.password && (
                                <span className="mt-2 block text-xs font-bold text-red-500">
                                    {errors.password.message}
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
                            {isSubmitting ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm font-semibold text-[#71717a]">
                        Don't have an account?{' '}
                        <a href="/register" className="font-extrabold text-[#2f61c9] hover:text-[#244fa8]">
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Login;
