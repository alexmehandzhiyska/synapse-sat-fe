import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import authService from '../../../services/authService';
import RequestCodeStep from './RequestCodeStep';

vi.mock('../../../services/authService', () => ({
    default: { forgotPassword: vi.fn() },
}));

const renderStep = () => {
    const onSuccess = vi.fn();

    render(<RequestCodeStep onSuccess={onSuccess} />);

    return { onSuccess };
};

const getEmailInput = () => screen.getByLabelText('Email address');

const submit = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Send verification code' }));
};

const requestCode = () => {
    fireEvent.change(getEmailInput(), { target: { value: 'pencho@test.com' } });
    submit();
};

describe('RequestCodeStep', () => {
    beforeEach(() => {
        vi.mocked(authService.forgotPassword).mockReset().mockResolvedValue({ success: true, message: 'Code sent' });
    });

    afterEach(() => {
        cleanup();
    });

    it('shows required error for empty email', async () => {
        renderStep();

        submit();

        expect(await screen.findByText('Email address is required')).toBeInTheDocument();
        expect(authService.forgotPassword).not.toHaveBeenCalled();
    });

    it('requests code for email', async () => {
        renderStep();

        requestCode();

        await waitFor(() => {
            expect(authService.forgotPassword).toHaveBeenCalledWith({ email: 'pencho@test.com' });
        });
    });

    it('calls onSuccess with email after requesting', async () => {
        const { onSuccess } = renderStep();

        requestCode();

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith('pencho@test.com');
        });
    });

    it('shows sending state while submitting', async () => {
        vi.mocked(authService.forgotPassword).mockReturnValue(new Promise(() => {}));
        renderStep();

        requestCode();

        expect(await screen.findByRole('button', { name: 'Sending code...' })).toBeDisabled();
    });

    it('shows error message when request fails', async () => {
        vi.mocked(authService.forgotPassword).mockRejectedValue(new Error('User not found'));
        const { onSuccess } = renderStep();

        requestCode();

        expect(await screen.findByText('User not found')).toBeInTheDocument();
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(authService.forgotPassword).mockRejectedValue('error');
        renderStep();

        requestCode();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });
});