import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import authService from '../../../../services/authService';

type AdminGuardProps = {
    children: ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
    const user = authService.getCurrentUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminGuard;