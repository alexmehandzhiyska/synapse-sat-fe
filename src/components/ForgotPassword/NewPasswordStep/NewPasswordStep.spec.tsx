import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import authService from '../../../services/authService';
import NewPasswordStep from './NewPasswordStep';

vi.mock('../../../services/authService', () => ({
    default: { resetPassword: vi.fn() },
}));

const renderStep = () => {
    const onSuccess = vi.fn();

    render(<NewPasswordStep email="pencho@test.com" code="123456" onSuccess={onSuccess} />);

    return { onSuccess };
};

const submit = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Reset password' }));
};

const resetPassword = (newPassword = 'Password1!', confirmNewPassword = newPassword) => {
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: newPassword } });
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: confirmNewPassword } });
    submit();
};

const expectValidationError = async (message: string) => {
    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(authService.resetPassword).not.toHaveBeenCalled();
};

describe('NewPasswordStep', () => {
    beforeEach(() => {
        vi.mocked(authService.resetPassword).mockReset().mockResolvedValue({ success: true, message: 'Password reset' });
    });

    afterEach(() => {
        cleanup();
    });

    it('shows required errors for empty fields', async () => {
        renderStep();

        submit();

        await expectValidationError('Password is required');
        expect(screen.getByText('Confirm your new password')).toBeInTheDocument();
    });

    it('shows error for password shorter than 8 characters', async () => {
        renderStep();

        resetPassword('Pass1!');

        await expectValidationError('Password must be at least 8 characters');
    });

    it('shows error for password longer than 72 characters', async () => {
        renderStep();

        resetPassword(`Password1!${'a'.repeat(63)}`);

        await expectValidationError('Password must be at most 72 characters');
    });

    it('shows error for password without digit', async () => {
        renderStep();

        resetPassword('Password!');

        await expectValidationError('Password must contain at least 1 digit and 1 special character');
    });

    it('shows error for password without special character', async () => {
        renderStep();

        resetPassword('Password1');

        await expectValidationError('Password must contain at least 1 digit and 1 special character');
    });

    it('shows error when passwords do not match', async () => {
        renderStep();

        resetPassword('Password1!', 'Password2!');

        await expectValidationError('Passwords do not match');
    });

    it('resets password with email and code', async () => {
        renderStep();

        resetPassword();

        await waitFor(() => {
            expect(authService.resetPassword).toHaveBeenCalledWith({
                email: 'pencho@test.com',
                code: '123456',
                newPassword: 'Password1!',
                confirmNewPassword: 'Password1!',
            });
        });
    });

    it('calls onSuccess after resetting', async () => {
        const { onSuccess } = renderStep();

        resetPassword();

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledTimes(1);
        });
    });

    it('shows resetting state while submitting', async () => {
        vi.mocked(authService.resetPassword).mockReturnValue(new Promise(() => {}));
        renderStep();

        resetPassword();

        expect(await screen.findByRole('button', { name: 'Resetting password...' })).toBeDisabled();
    });

    it('shows error message when reset fails', async () => {
        vi.mocked(authService.resetPassword).mockRejectedValue(new Error('Invalid or expired code'));
        const { onSuccess } = renderStep();

        resetPassword();

        expect(await screen.findByText('Invalid or expired code')).toBeInTheDocument();
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(authService.resetPassword).mockRejectedValue('error');
        renderStep();

        resetPassword();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });
});