import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import authService from '../../services/authService';
import type { AuthUser, UserRole } from '../../types/auth';
import Course from './Course';

vi.mock('../../services/authService', () => ({
    default: { getCurrentUser: vi.fn() },
}));

vi.mock('./StudentCourseView/StudentCourseView', () => ({
    default: () => <div>Student course view</div>,
}));

vi.mock('./TeacherCourseView', () => ({
    default: () => <div>Teacher course view</div>,
}));

const renderCourse = () => {
    render(
        <MemoryRouter>
            <Course />
        </MemoryRouter>,
    );
};

const logInAs = (role: UserRole) => {
    localStorage.setItem('accessToken', 'access-token');
    vi.mocked(authService.getCurrentUser).mockReturnValue({ role } as AuthUser);
};

describe('Course', () => {
    beforeEach(() => {
        vi.mocked(authService.getCurrentUser).mockReset().mockReturnValue(null);
    });

    afterEach(() => {
        cleanup();
        localStorage.clear();
    });

    it('asks logged out user to log in', () => {
        renderCourse();

        expect(screen.getByRole('heading', { name: 'Log in to see your lessons' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
    });

    it('renders teacher view for teacher', () => {
        logInAs('teacher');

        renderCourse();

        expect(screen.getByText('Teacher course view')).toBeInTheDocument();
        expect(screen.queryByText('Student course view')).not.toBeInTheDocument();
    });

    it('renders student view for student', () => {
        logInAs('student');

        renderCourse();

        expect(screen.getByText('Student course view')).toBeInTheDocument();
        expect(screen.queryByText('Teacher course view')).not.toBeInTheDocument();
    });
});