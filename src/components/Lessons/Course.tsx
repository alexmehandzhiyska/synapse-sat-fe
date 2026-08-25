import { Link } from 'react-router-dom';

import authService from '../../services/authService';
import StudentCourseView from './StudentCourseView/StudentCourseView';
import TeacherCourseView from './TeacherCourseView';

const Course = () => {
    const isTeacher = authService.getCurrentUser()?.role === 'teacher';
    const isLoggedIn = Boolean(localStorage.getItem('accessToken'));

    if (!isLoggedIn) {
        return (
            <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
                <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center">
                    <h2 className="mb-3 font-['Space_Grotesk'] text-2xl font-extrabold text-[#1b1b1f]">
                        Log in to see your lessons
                    </h2>
                    <Link
                        to="/login"
                        className="inline-flex rounded-xl bg-[#13385A] px-5 py-2.5 text-sm font-bold text-white"
                    >
                        Log in
                    </Link>
                </div>
            </section>
        );
    }

    if (isTeacher) {
        return <TeacherCourseView />;
    }

    return (
        <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
            <StudentCourseView />
        </section>
    );
};

export default Course;
