import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import authService from '../../../../services/authService';

type StudentGuardProps = {
    children: ReactNode;
}

const StudentGuard = ({ children }: StudentGuardProps) => {
    const user = authService.getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'student') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default StudentGuard;