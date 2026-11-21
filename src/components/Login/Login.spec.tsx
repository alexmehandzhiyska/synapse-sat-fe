import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import authService from '../../services/authService';
import Login from './Login';

vi.mock('../../services/authService', () => ({
    default: { login: vi.fn() },
}));

const submit = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
};

const logIn = (email = 'pencho@test.com', password = 'Password1!') => {
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: email } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: password } });
    submit();
};

describe('Login', () => {
    beforeEach(() => {
        vi.stubGlobal('location', { href: '/login' });
        vi.mocked(authService.login).mockReset().mockResolvedValue({
            success: true,
            message: 'Logged in',
            user: { id: 'user-1', firstName: 'Pencho', lastName: 'Dimitrov', email: 'pencho@test.com', role: 'student' },
            accessToken: 'access-token',
        });
    });

    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
    });

    it('links to forgot password', () => {
        render(<Login />);

        expect(screen.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute('href', '/forgot-password');
    });

    it('links to register', () => {
        render(<Login />);

        expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '/register');
    });

    it('shows required errors for empty fields', async () => {
        render(<Login />);

        submit();

        expect(await screen.findByText('Email address is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
        expect(authService.login).not.toHaveBeenCalled();
    });

    it('logs in with email and password', async () => {
        render(<Login />);

        logIn();

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({ email: 'pencho@test.com', password: 'Password1!' });
        });
    });

    it('redirects to home after logging in', async () => {
        render(<Login />);

        logIn();

        await waitFor(() => {
            expect(window.location.href).toBe('/');
        });
    });

    it('shows logging in state while submitting', async () => {
        vi.mocked(authService.login).mockReturnValue(new Promise(() => {}));
        render(<Login />);

        logIn();

        expect(await screen.findByRole('button', { name: 'Logging in...' })).toBeDisabled();
    });

    it('shows error message when login fails', async () => {
        vi.mocked(authService.login).mockRejectedValue(new Error('Invalid email or password'));
        render(<Login />);

        logIn();

        expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log in' })).toBeEnabled();
        expect(window.location.href).toBe('/login');
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(authService.login).mockRejectedValue('error');
        render(<Login />);

        logIn();

        expect(await screen.findByText('Login failed.')).toBeInTheDocument();
    });
});