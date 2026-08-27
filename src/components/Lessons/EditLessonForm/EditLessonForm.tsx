import { useState } from 'react';
import { useForm } from 'react-hook-form';

import lessonsService from '../../../services/lessonsService';
import type { Lesson, UpdateLessonData } from '../../../types/lesson';

const EditLessonForm = ({ lesson, onSaved, onCancel }: { lesson: Lesson; onSaved: () => void; onCancel: () => void }) => {
    const [submitError, setSubmitError] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateLessonData>({ defaultValues: { title: lesson.title, videoUrl: lesson.videoUrl } });

    const handleFormSubmit = async (data: UpdateLessonData) => {
        setSubmitError('');

        try {
            await lessonsService.updateLesson(lesson.id, data);
            onSaved();
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong.');
        }
    };

    return (
        <form className="flex flex-wrap items-start gap-3 rounded-xl bg-white p-4" onSubmit={handleSubmit(handleFormSubmit)}>
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
                className="h-10 rounded-xl bg-[#2f61c9] px-4 text-sm font-bold text-white transition hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="h-10 rounded-xl border-2 border-slate-200 px-4 text-sm font-bold text-[#13385A] transition hover:border-blue-200"
            >
                Cancel
            </button>
            {submitError && <p className="w-full text-xs font-bold text-red-500">{submitError}</p>}
        </form>
    );
};

export default EditLessonForm;