import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import authService from '../../services/authService';
import type { RegisterData } from '../../types/auth';
import Register from './Register';

vi.mock('../../services/authService', () => ({
    default: { register: vi.fn() },
}));

const registerData: RegisterData = {
    firstName: 'Pencho',
    lastName: 'Dimitrov',
    email: 'pencho@test.com',
    password: 'Password1!',
    confirmPassword: 'Password1!',
    country: 'Country',
    city: 'City',
    school: 'School',
};

const changeField = (label: string, value: string) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
};

const submit = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
};

const registerWith = (overrides: Partial<RegisterData> = {}) => {
    const data = { ...registerData, ...overrides };

    changeField('First name *', data.firstName);
    changeField('Last name *', data.lastName);
    changeField('Email address *', data.email);
    changeField('Password *', data.password);
    changeField('Confirm password *', data.confirmPassword);
    changeField('Country', data.country ?? '');
    changeField('City', data.city ?? '');
    changeField('School', data.school ?? '');
    
    submit();
};

const expectValidationError = async (message: string) => {
    expect(await screen.findByText(message)).toBeInTheDocument();
    expect(authService.register).not.toHaveBeenCalled();
};

describe('Register', () => {
    beforeEach(() => {
        vi.stubGlobal('location', { href: '/register' });
        vi.mocked(authService.register).mockReset().mockResolvedValue({
            success: true,
            message: 'Registered',
            user: { id: 'user-1', firstName: 'Pencho', lastName: 'Dimitrov', email: 'pencho@test.com', role: 'student' },
            accessToken: 'access-token',
        });
    });

    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
    });

    it('links to login', () => {
        render(<Register />);

        expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
    });

    it('shows required errors for empty fields', async () => {
        render(<Register />);

        submit();

        await expectValidationError('First name is required');
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Email address is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
        expect(screen.getByText('Confirm your password')).toBeInTheDocument();
    });

    it('shows error for first name longer than 100 characters', async () => {
        render(<Register />);

        registerWith({ firstName: 'a'.repeat(101) });

        await expectValidationError('First name must be at most 100 characters');
    });

    it('shows error for last name longer than 100 characters', async () => {
        render(<Register />);

        registerWith({ lastName: 'a'.repeat(101) });

        await expectValidationError('Last name must be at most 100 characters');
    });

    it('shows error for email shorter than 5 characters', async () => {
        render(<Register />);

        registerWith({ email: 'a@b' });

        await expectValidationError('Email address must be at least 5 characters');
    });

    it('shows error for email longer than 200 characters', async () => {
        render(<Register />);

        registerWith({ email: `${'a'.repeat(192)}@test.com` });

        await expectValidationError('Email address must be at most 200 characters');
    });

    it('shows error for email without domain extension', async () => {
        render(<Register />);

        registerWith({ email: 'pencho@test' });

        await expectValidationError('Enter a valid email address');
    });

    it('shows error for password shorter than 8 characters', async () => {
        render(<Register />);

        registerWith({ password: 'Pass1!', confirmPassword: 'Pass1!' });

        await expectValidationError('Password must be at least 8 characters');
    });

    it('shows error for password longer than 72 characters', async () => {
        const password = `Password1!${'a'.repeat(63)}`;
        render(<Register />);

        registerWith({ password, confirmPassword: password });

        await expectValidationError('Password must be at most 72 characters');
    });

    it('shows error for password without digit', async () => {
        render(<Register />);

        registerWith({ password: 'Password!', confirmPassword: 'Password!' });

        await expectValidationError('Password must contain at least 1 digit and 1 special character');
    });

    it('shows error for password without special character', async () => {
        render(<Register />);

        registerWith({ password: 'Password1', confirmPassword: 'Password1' });

        await expectValidationError('Password must contain at least 1 digit and 1 special character');
    });

    it('shows error when passwords do not match', async () => {
        render(<Register />);

        registerWith({ confirmPassword: 'Password2!' });

        await expectValidationError('Passwords do not match');
    });

    it('registers with all fields', async () => {
        render(<Register />);

        registerWith();

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalledWith(registerData);
        });
    });

    it('registers without optional fields', async () => {
        render(<Register />);

        registerWith({ country: '', city: '', school: '' });

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalledWith({ ...registerData, country: '', city: '', school: '' });
        });
    });

    it('redirects to home after registering', async () => {
        render(<Register />);

        registerWith();

        await waitFor(() => {
            expect(window.location.href).toBe('/');
        });
    });

    it('shows creating account state while submitting', async () => {
        vi.mocked(authService.register).mockReturnValue(new Promise(() => {}));
        render(<Register />);

        registerWith();

        expect(await screen.findByRole('button', { name: 'Creating account...' })).toBeDisabled();
    });

    it('shows error message when registration fails', async () => {
        vi.mocked(authService.register).mockRejectedValue(new Error('Email already in use'));
        render(<Register />);

        registerWith();

        expect(await screen.findByText('Email already in use')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create account' })).toBeEnabled();
        expect(window.location.href).toBe('/register');
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(authService.register).mockRejectedValue('error');
        render(<Register />);

        registerWith();

        expect(await screen.findByText('Registration failed.')).toBeInTheDocument();
    });
});