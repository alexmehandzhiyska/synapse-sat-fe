import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ForgotPassword from './ForgotPassword';

vi.mock('./RequestCodeStep/RequestCodeStep', () => ({
    default: ({ onSuccess }: { onSuccess: (email: string) => void }) => (
        <button onClick={() => onSuccess('pencho@test.com')}>Request code</button>
    ),
}));

vi.mock('./VerifyCodeStep/VerifyCodeStep', () => ({
    default: ({ email, onSuccess }: { email: string; onSuccess: (code: string) => void }) => (
        <div>
            <p>Verify code for {email}</p>
            <button onClick={() => onSuccess('123456')}>Verify code</button>
        </div>
    ),
}));

vi.mock('./NewPasswordStep/NewPasswordStep', () => ({
    default: ({ email, code, onSuccess }: { email: string; code: string; onSuccess: () => void }) => (
        <div>
            <p>New password for {email} with {code}</p>
            <button onClick={onSuccess}>Reset password</button>
        </div>
    ),
}));

const click = (name: string) => {
    fireEvent.click(screen.getByRole('button', { name }));
};

describe('ForgotPassword', () => {
    afterEach(() => {
        cleanup();
    });

    it('starts on request code step', () => {
        render(<ForgotPassword />);

        expect(screen.getByRole('button', { name: 'Request code' })).toBeInTheDocument();
    });

    it('moves to verify code step with requested email', () => {
        render(<ForgotPassword />);

        click('Request code');

        expect(screen.getByText('Verify code for pencho@test.com')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Request code' })).not.toBeInTheDocument();
    });

    it('moves to new password step with email and verified code', () => {
        render(<ForgotPassword />);

        click('Request code');
        click('Verify code');

        expect(screen.getByText('New password for pencho@test.com with 123456')).toBeInTheDocument();
        expect(screen.queryByText('Verify code for pencho@test.com')).not.toBeInTheDocument();
    });

    it('shows success message with login link after reset', () => {
        render(<ForgotPassword />);

        click('Request code');
        click('Verify code');
        click('Reset password');

        expect(screen.getByText(/Your password has been reset/)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'log in' })).toHaveAttribute('href', '/login');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});