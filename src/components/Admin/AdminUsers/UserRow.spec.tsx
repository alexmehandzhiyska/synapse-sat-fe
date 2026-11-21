import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import adminService from '../../../services/adminService';
import type { AdminUser } from '../../../types/auth';
import UserRow from './UserRow';

vi.mock('../../../services/adminService', () => ({
    default: { deactivateUser: vi.fn(), activateUser: vi.fn() },
}));

vi.mock('./UserEditForm', () => ({
    default: ({ user, onSave, onCancel }: { user: AdminUser; onSave: (user: AdminUser) => void; onCancel: () => void }) => (
        <div>
            <p>Editing {user.firstName}</p>
            <button onClick={() => onSave({ ...user, firstName: 'Mincho' })}>Save user</button>
            <button onClick={onCancel}>Cancel editing</button>
        </div>
    ),
}));

const activeUser: AdminUser = {
    id: 'user-1',
    firstName: 'Pencho',
    lastName: 'Dimitrov',
    email: 'pencho@test.com',
    role: 'student',
    country: null,
    city: null,
    school: null,
    isActive: true,
};

const deactivatedUser: AdminUser = { ...activeUser, isActive: false };

const renderRow = (user = activeUser) => {
    const onUpdated = vi.fn();

    render(<UserRow user={user} onUpdated={onUpdated} />);

    return { onUpdated };
};

const getModal = () => screen.getByRole('heading', { name: 'Deactivate account?' }).parentElement as HTMLElement;

const openDeactivateConfirm = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Deactivate' }));
};

const confirmDeactivate = () => {
    openDeactivateConfirm();
    fireEvent.click(within(getModal()).getByRole('button', { name: 'Deactivate' }));
};

const activate = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Activate' }));
};

describe('UserRow', () => {
    beforeEach(() => {
        vi.mocked(adminService.deactivateUser).mockReset().mockResolvedValue(deactivatedUser);
        vi.mocked(adminService.activateUser).mockReset().mockResolvedValue(activeUser);
    });

    afterEach(() => {
        cleanup();
    });

    it('shows name, email and role', () => {
        renderRow();

        expect(screen.getByRole('heading', { name: 'Pencho Dimitrov' })).toBeInTheDocument();
        expect(screen.getByText('pencho@test.com')).toBeInTheDocument();
        expect(screen.getByText('Student')).toBeInTheDocument();
    });

    it('shows active status in green', () => {
        renderRow();

        expect(screen.getByText('Active')).toHaveClass('bg-emerald-50');
    });

    it('shows deactivated status in red', () => {
        renderRow(deactivatedUser);

        expect(screen.getByText('Deactivated')).toHaveClass('bg-red-50');
    });

    it('shows edit and deactivate for active user', () => {
        renderRow();

        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Deactivate' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Activate' })).not.toBeInTheDocument();
    });

    it('shows only activate for deactivated user', () => {
        renderRow(deactivatedUser);

        expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['Activate']);
    });

    it('hides actions for admin', () => {
        renderRow({ ...activeUser, role: 'admin' });

        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('opens edit form instead of row', () => {
        renderRow();

        fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

        expect(screen.getByText('Editing Pencho')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Pencho Dimitrov' })).not.toBeInTheDocument();
    });

    it('closes edit form on cancel', () => {
        const { onUpdated } = renderRow();

        fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
        fireEvent.click(screen.getByRole('button', { name: 'Cancel editing' }));

        expect(screen.queryByText('Editing Pencho')).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Pencho Dimitrov' })).toBeInTheDocument();
        expect(onUpdated).not.toHaveBeenCalled();
    });

    it('calls onUpdated and closes edit form after saving', () => {
        const { onUpdated } = renderRow();

        fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
        fireEvent.click(screen.getByRole('button', { name: 'Save user' }));

        expect(onUpdated).toHaveBeenCalledWith({ ...activeUser, firstName: 'Mincho' });
        expect(screen.queryByText('Editing Pencho')).not.toBeInTheDocument();
    });

    it('asks to confirm before deactivating', () => {
        renderRow();

        openDeactivateConfirm();

        expect(within(getModal()).getByText('Deactivate Pencho Dimitrov\'s account? They will no longer be able to log in.')).toBeInTheDocument();
        expect(adminService.deactivateUser).not.toHaveBeenCalled();
    });

    it('closes confirmation on cancel', () => {
        renderRow();
        openDeactivateConfirm();

        fireEvent.click(within(getModal()).getByRole('button', { name: 'Cancel' }));

        expect(screen.queryByRole('heading', { name: 'Deactivate account?' })).not.toBeInTheDocument();
        expect(adminService.deactivateUser).not.toHaveBeenCalled();
    });

    it('deactivates user and calls onUpdated after confirming', async () => {
        const { onUpdated } = renderRow();

        confirmDeactivate();

        await waitFor(() => {
            expect(onUpdated).toHaveBeenCalledWith(deactivatedUser);
        });

        expect(adminService.deactivateUser).toHaveBeenCalledWith('user-1');
        expect(screen.queryByRole('heading', { name: 'Deactivate account?' })).not.toBeInTheDocument();
    });

    it('shows deactivating state while deactivating', () => {
        vi.mocked(adminService.deactivateUser).mockReturnValue(new Promise(() => {}));
        renderRow();

        confirmDeactivate();

        expect(screen.getByRole('button', { name: 'Deactivating...' })).toBeDisabled();
    });

    it('shows error message when deactivating fails', async () => {
        vi.mocked(adminService.deactivateUser).mockRejectedValue(new Error('Could not deactivate user'));
        const { onUpdated } = renderRow();

        confirmDeactivate();

        expect(await screen.findByText('Could not deactivate user')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Deactivate' })).toBeEnabled();
        expect(onUpdated).not.toHaveBeenCalled();
    });

    it('shows fallback error when deactivating fails with non-error', async () => {
        vi.mocked(adminService.deactivateUser).mockRejectedValue('error');
        renderRow();

        confirmDeactivate();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });

    it('activates user and calls onUpdated', async () => {
        const { onUpdated } = renderRow(deactivatedUser);

        activate();

        await waitFor(() => {
            expect(onUpdated).toHaveBeenCalledWith(activeUser);
        });

        expect(adminService.activateUser).toHaveBeenCalledWith('user-1');
    });

    it('shows activating state while activating', () => {
        vi.mocked(adminService.activateUser).mockReturnValue(new Promise(() => {}));
        renderRow(deactivatedUser);

        activate();

        expect(screen.getByRole('button', { name: 'Activating...' })).toBeDisabled();
    });

    it('shows error message when activating fails', async () => {
        vi.mocked(adminService.activateUser).mockRejectedValue(new Error('Could not activate user'));
        const { onUpdated } = renderRow(deactivatedUser);

        activate();

        expect(await screen.findByText('Could not activate user')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Activate' })).toBeEnabled();
        expect(onUpdated).not.toHaveBeenCalled();
    });

    it('shows fallback error when activating fails with non-error', async () => {
        vi.mocked(adminService.activateUser).mockRejectedValue('error');
        renderRow(deactivatedUser);

        activate();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });
});