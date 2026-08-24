import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import practiceTestService from '../../../services/practiceTestService';
import type { CreatePracticeTestData } from '../../../types/practiceTest';

const AddPracticeTest = () => {
    const navigate = useNavigate();
    const [submitError, setSubmitError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreatePracticeTestData>({
        defaultValues: {
            title: '',
            type: 'standard',
        },
    });

    const handleFormSubmit = async (data: CreatePracticeTestData) => {
        setSubmitError('');

        try {
            const createdTest = await practiceTestService.create(data);
            navigate(`/practice-tests/${createdTest.id}/questions/add`);
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
        }
    };

    return (
        <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-2xl">
                <div className="mb-9">
                    <h1 className="mb-3 font-['Space_Grotesk'] text-4xl font-extrabold leading-tight text-[#13385A] sm:text-5xl">
                        Add practice test
                    </h1>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_24px_rgba(19,56,90,0.06)] sm:p-10">
                    <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
                        <label className="block">
                            <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                                Title
                            </span>
                            <input
                                type="text"
                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                {...register('title', {
                                    required: 'Title is required',
                                    maxLength: {
                                        value: 200,
                                        message: 'Title must be at most 200 characters',
                                    },
                                })}
                            />
                            {errors.title && (
                                <span className="mt-2 block text-xs font-bold text-red-500">
                                    {errors.title.message}
                                </span>
                            )}
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                                Type
                            </span>
                            <select
                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                {...register('type', { required: true })}
                            >
                                <option value="standard">Standard</option>
                                <option value="diagnostic">Diagnostic</option>
                                <option value="check_in">Check-in</option>
                            </select>
                        </label>

                        {submitError && (
                            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                                {submitError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex h-12 items-center justify-center rounded-2xl bg-[#2f61c9] px-8 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:bg-[#8da8df]"
                        >
                            {isSubmitting ? 'Creating...' : 'Create test'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddPracticeTest;