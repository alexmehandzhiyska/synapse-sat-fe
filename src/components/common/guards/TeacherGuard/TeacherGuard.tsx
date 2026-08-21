import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import authService from '../../../../services/authService';

type TeacherGuardProps = {
    children: ReactNode;
}

const TeacherGuard = ({ children }: TeacherGuardProps) => {
    const user = authService.getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'teacher') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default TeacherGuard;