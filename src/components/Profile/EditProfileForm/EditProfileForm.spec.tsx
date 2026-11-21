import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import userService from '../../../services/userService';
import type { UserProfile } from '../../../types/auth';
import EditProfileForm from './EditProfileForm';

vi.mock('../../../services/userService', () => ({
    default: { update: vi.fn() },
}));

const profile: UserProfile = {
    id: 'user-1',
    firstName: 'Pencho',
    lastName: 'Dimitrov',
    email: 'pencho@test.com',
    country: 'Country',
    city: 'City',
    school: 'School',
    role: 'student',
};

const updatedProfile: UserProfile = { ...profile, firstName: 'Mincho', lastName: 'Ivanov' };

const renderForm = (formProfile = profile) => {
    const onSuccess = vi.fn();
    const onCancel = vi.fn();

    render(<EditProfileForm profile={formProfile} onSuccess={onSuccess} onCancel={onCancel} />);

    return { onSuccess, onCancel };
};

const changeField = (label: string, value: string) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
};

const save = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
};

const expectValidationError = async (message: string) => {
    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(userService.update).not.toHaveBeenCalled();
};

describe('EditProfileForm', () => {
    beforeEach(() => {
        vi.mocked(userService.update).mockReset().mockResolvedValue(updatedProfile);
    });

    afterEach(() => {
        cleanup();
    });

    it('prefills fields with profile', () => {
        renderForm();

        expect(screen.getByLabelText('First name')).toHaveValue('Pencho');
        expect(screen.getByLabelText('Last name')).toHaveValue('Dimitrov');
        expect(screen.getByLabelText('Country')).toHaveValue('Country');
        expect(screen.getByLabelText('City')).toHaveValue('City');
        expect(screen.getByLabelText('School')).toHaveValue('School');
    });

    it('leaves missing optional fields empty', () => {
        renderForm({ ...profile, country: null, city: null, school: null });

        expect(screen.getByLabelText('Country')).toHaveValue('');
        expect(screen.getByLabelText('City')).toHaveValue('');
        expect(screen.getByLabelText('School')).toHaveValue('');
    });

    it('shows required errors for empty names', async () => {
        renderForm();

        changeField('First name', '');
        changeField('Last name', '');

        save();

        await expectValidationError('First name is required');
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
    });

    it('shows error for first name longer than 100 characters', async () => {
        renderForm();

        changeField('First name', 'a'.repeat(101));

        save();

        await expectValidationError('First name must be at most 100 characters');
    });

    it('shows error for last name longer than 100 characters', async () => {
        renderForm();

        changeField('Last name', 'a'.repeat(101));

        save();

        await expectValidationError('Last name must be at most 100 characters');
    });

    it('updates profile with edited fields', async () => {
        renderForm();

        changeField('First name', 'Mincho');
        changeField('Last name', 'Ivanov');
        changeField('Country', '');

        save();

        await waitFor(() => {
            expect(userService.update).toHaveBeenCalledWith({
                firstName: 'Mincho',
                lastName: 'Ivanov',
                country: '',
                city: 'City',
                school: 'School',
            });
        });
    });

    it('calls onSuccess with updated profile', async () => {
        const { onSuccess } = renderForm();

        save();

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith(updatedProfile);
        });
    });

    it('shows saving state while submitting', async () => {
        vi.mocked(userService.update).mockReturnValue(new Promise(() => {}));
        renderForm();

        save();

        expect(await screen.findByRole('button', { name: 'Saving...' })).toBeDisabled();
    });

    it('shows error message when saving fails', async () => {
        vi.mocked(userService.update).mockRejectedValue(new Error('Could not update profile'));
        const { onSuccess } = renderForm();

        save();

        expect(await screen.findByText('Could not update profile')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(userService.update).mockRejectedValue('error');
        renderForm();

        save();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });

    it('calls onCancel on cancel', () => {
        const { onCancel } = renderForm();

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(userService.update).not.toHaveBeenCalled();
    });
});