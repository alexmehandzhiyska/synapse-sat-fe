import { useState } from 'react';
import { useForm } from 'react-hook-form';

import lessonsService from '../../../services/lessonsService';
import type { CreateLessonData } from '../../../types/lesson';
import type { Domain } from '../../../types/practiceTest';

const AddLessonForm = ({ domain, onCreated }: { domain: Domain; onCreated: () => void }) => {
    const [submitError, setSubmitError] = useState('');
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateLessonData>({ defaultValues: { title: '', videoUrl: '' } });

    const handleFormSubmit = async (data: CreateLessonData) => {
        setSubmitError('');

        try {
            await lessonsService.createLesson(domain, data);
            onCreated();
            reset();
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
        }
    };

    return (
        <form className="mt-3 flex flex-wrap items-start gap-3" onSubmit={handleSubmit(handleFormSubmit)}>
            <div>
                <input
                    type="text"
                    placeholder="Lesson title"
                    className="h-10 w-48 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white"
                    {...register('title', { required: true })}
                />
                {errors.title && <p className="mt-1 text-xs font-bold text-red-500">Required</p>}
            </div>
            <div>
                <input
                    type="url"
                    placeholder="Video URL"
                    className="h-10 w-64 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white"
                    {...register('videoUrl', { required: true })}
                />
                {errors.videoUrl && <p className="mt-1 text-xs font-bold text-red-500">Required</p>}
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 rounded-xl border-2 border-slate-200 px-4 text-sm font-bold text-[#13385A] transition hover:border-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? 'Adding...' : 'Add lesson'}
            </button>
            {submitError && <p className="w-full text-xs font-bold text-red-500">{submitError}</p>}
        </form>
    );
};

export default AddLessonForm;