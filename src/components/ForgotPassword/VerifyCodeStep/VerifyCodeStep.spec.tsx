import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import authService from '../../../services/authService';
import VerifyCodeStep from './VerifyCodeStep';

vi.mock('../../../services/authService', () => ({
    default: { verifyResetCode: vi.fn() },
}));

const renderStep = () => {
    const onSuccess = vi.fn();

    render(<VerifyCodeStep email="pencho@test.com" onSuccess={onSuccess} />);

    return { onSuccess };
};

const getCodeInput = () => screen.getByLabelText('Verification code');

const submit = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Verify code' }));
};

const verifyCode = (code = '123456') => {
    fireEvent.change(getCodeInput(), { target: { value: code } });
    submit();
};

describe('VerifyCodeStep', () => {
    beforeEach(() => {
        vi.mocked(authService.verifyResetCode).mockReset().mockResolvedValue({ success: true, message: 'Code verified' });
    });

    afterEach(() => {
        cleanup();
    });

    it('shows email code was sent to', () => {
        renderStep();

        expect(screen.getByText('pencho@test.com')).toBeInTheDocument();
    });

    it('shows required error for empty code', async () => {
        renderStep();

        submit();

        expect(await screen.findByText('Verification code is required')).toBeInTheDocument();
        expect(authService.verifyResetCode).not.toHaveBeenCalled();
    });

    it('shows format error for code shorter than 6 digits', async () => {
        renderStep();

        verifyCode('12345');

        expect(await screen.findByText('Enter the 6-digit code')).toBeInTheDocument();
        expect(authService.verifyResetCode).not.toHaveBeenCalled();
    });

    it('shows format error for non-numeric code', async () => {
        renderStep();

        verifyCode('12345a');

        expect(await screen.findByText('Enter the 6-digit code')).toBeInTheDocument();
        expect(authService.verifyResetCode).not.toHaveBeenCalled();
    });

    it('verifies code for email', async () => {
        renderStep();

        verifyCode();

        await waitFor(() => {
            expect(authService.verifyResetCode).toHaveBeenCalledWith({ email: 'pencho@test.com', code: '123456' });
        });
    });

    it('calls onSuccess with code after verifying', async () => {
        const { onSuccess } = renderStep();

        verifyCode();

        await waitFor(() => {
            expect(onSuccess).toHaveBeenCalledWith('123456');
        });
    });

    it('shows verifying state while submitting', async () => {
        vi.mocked(authService.verifyResetCode).mockReturnValue(new Promise(() => {}));
        renderStep();

        verifyCode();

        expect(await screen.findByRole('button', { name: 'Verifying...' })).toBeDisabled();
    });

    it('shows error message when verification fails', async () => {
        vi.mocked(authService.verifyResetCode).mockRejectedValue(new Error('Invalid or expired code'));
        const { onSuccess } = renderStep();

        verifyCode();

        expect(await screen.findByText('Invalid or expired code')).toBeInTheDocument();
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(authService.verifyResetCode).mockRejectedValue('error');
        renderStep();

        verifyCode();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });
});