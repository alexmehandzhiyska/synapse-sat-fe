import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import adminService from '../../../../services/adminService';
import type { AdminUser } from '../../../../types/auth';
import UserEditForm from './UserEditForm';

vi.mock('../../../../services/adminService', () => ({
    default: { updateUser: vi.fn() },
}));

const user: AdminUser = {
    id: 'user-1',
    firstName: 'Pencho',
    lastName: 'Dimitrov',
    email: 'pencho@test.com',
    role: 'student',
    country: 'Country',
    city: 'City',
    school: 'School',
    isActive: true,
};

const updatedUser: AdminUser = { ...user, firstName: 'Mincho', lastName: 'Ivanov', role: 'teacher' };

const renderForm = (formUser = user) => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(<UserEditForm user={formUser} onSave={onSave} onCancel={onCancel} />);

    return { onSave, onCancel };
};

const changeField = (label: string, value: string) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
};

const save = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
};

describe('UserEditForm', () => {
    beforeEach(() => {
        vi.mocked(adminService.updateUser).mockReset().mockResolvedValue(updatedUser);
    });

    afterEach(() => {
        cleanup();
    });

    it('prefills fields with user', () => {
        renderForm();

        expect(screen.getByLabelText('First name')).toHaveValue('Pencho');
        expect(screen.getByLabelText('Last name')).toHaveValue('Dimitrov');
        expect(screen.getByLabelText('Country')).toHaveValue('Country');
        expect(screen.getByLabelText('City')).toHaveValue('City');
        expect(screen.getByLabelText('School')).toHaveValue('School');
        expect(screen.getByLabelText('Role')).toHaveValue('student');
    });

    it('leaves missing optional fields empty', () => {
        renderForm({ ...user, country: null, city: null, school: null });

        expect(screen.getByLabelText('Country')).toHaveValue('');
        expect(screen.getByLabelText('City')).toHaveValue('');
        expect(screen.getByLabelText('School')).toHaveValue('');
    });

    it('lists all roles', () => {
        renderForm();

        expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Student', 'Teacher', 'Admin']);
    });

    it('shows required errors for empty names', async () => {
        renderForm();

        changeField('First name', '');
        changeField('Last name', '');

        save();

        expect(await screen.findByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(adminService.updateUser).not.toHaveBeenCalled();
    });

    it('updates user with edited fields', async () => {
        renderForm();

        changeField('First name', 'Mincho');
        changeField('Last name', 'Ivanov');
        changeField('Country', '');
        changeField('Role', 'teacher');

        save();

        await waitFor(() => {
            expect(adminService.updateUser).toHaveBeenCalledWith('user-1', {
                firstName: 'Mincho',
                lastName: 'Ivanov',
                country: '',
                city: 'City',
                school: 'School',
                role: 'teacher',
            });
        });
    });

    it('calls onSave with updated user', async () => {
        const { onSave } = renderForm();

        save();

        await waitFor(() => {
            expect(onSave).toHaveBeenCalledWith(updatedUser);
        });
    });

    it('shows saving state while submitting', async () => {
        vi.mocked(adminService.updateUser).mockReturnValue(new Promise(() => {}));
        renderForm();

        save();

        expect(await screen.findByRole('button', { name: 'Saving...' })).toBeDisabled();
    });

    it('shows error message when saving fails', async () => {
        vi.mocked(adminService.updateUser).mockRejectedValue(new Error('Could not update user'));
        const { onSave } = renderForm();

        save();

        expect(await screen.findByText('Could not update user')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
        expect(onSave).not.toHaveBeenCalled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(adminService.updateUser).mockRejectedValue('error');
        renderForm();

        save();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });

    it('calls onCancel on cancel', () => {
        const { onCancel } = renderForm();

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(adminService.updateUser).not.toHaveBeenCalled();
    });
});