import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import adminService from '../../../services/adminService';
import type { AdminUser } from '../../../types/auth';
import AdminUsers from './AdminUsers';

vi.mock('../../../services/adminService', () => ({
    default: { getAllUsers: vi.fn() },
}));

vi.mock('./UserRow', () => ({
    default: ({ user, onUpdated }: { user: AdminUser; onUpdated: (user: AdminUser) => void }) => (
        <div>
            <h3>{user.id}: {user.firstName}</h3>
            <button onClick={() => onUpdated({ ...user, firstName: 'Mincho' })}>Update {user.id}</button>
        </div>
    ),
}));

const createUser = (id: string): AdminUser => ({
    id,
    firstName: 'Pencho',
    lastName: 'Dimitrov',
    email: 'pencho@test.com',
    role: 'student',
    country: null,
    city: null,
    school: null,
    isActive: true,
});

const createUsers = (count: number) => Array.from({ length: count }, (_, index) => createUser(`user-${index + 1}`));

const renderLoadedPage = async () => {
    render(<AdminUsers />);

    await screen.findByText('user-1: Pencho');
};

const getUserIds = () => screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent?.split(':')[0]);

const clickPageButton = (name: string) => {
    fireEvent.click(screen.getByRole('button', { name }));
};

describe('AdminUsers', () => {
    beforeEach(() => {
        vi.mocked(adminService.getAllUsers).mockReset().mockResolvedValue(createUsers(45));
    });

    afterEach(() => {
        cleanup();
    });

    it('shows placeholders while loading', () => {
        vi.mocked(adminService.getAllUsers).mockReturnValue(new Promise(() => {}));

        const { container } = render(<AdminUsers />);

        expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3);
    });

    it('shows error when loading fails', async () => {
        vi.mocked(adminService.getAllUsers).mockRejectedValue(new Error('Server error'));

        render(<AdminUsers />);

        expect(await screen.findByRole('heading', { name: 'We couldn\'t load accounts' })).toBeInTheDocument();
        expect(screen.getByText('Error loading accounts. Try again later')).toBeInTheDocument();
    });

    it('shows first 20 users', async () => {
        await renderLoadedPage();

        expect(getUserIds()).toEqual(createUsers(20).map((user) => user.id));
    });

    it('hides pagination for 20 users or fewer', async () => {
        vi.mocked(adminService.getAllUsers).mockResolvedValue(createUsers(20));

        await renderLoadedPage();

        expect(screen.queryByText('Page 1 of 1')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    });

    it('starts on first page with previous disabled', async () => {
        await renderLoadedPage();

        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    });

    it('shows next page of users', async () => {
        await renderLoadedPage();

        clickPageButton('Next');

        expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
        expect(getUserIds()[0]).toBe('user-21');
        expect(getUserIds()).toHaveLength(20);
    });

    it('goes back to previous page', async () => {
        await renderLoadedPage();
        
        clickPageButton('Next');
        clickPageButton('Previous');

        expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
        expect(getUserIds()[0]).toBe('user-1');
    });

    it('shows remaining users on last page with next disabled', async () => {
        await renderLoadedPage();

        clickPageButton('Next');
        clickPageButton('Next');

        expect(screen.getByText('Page 3 of 3')).toBeInTheDocument();
        expect(getUserIds()).toEqual(['user-41', 'user-42', 'user-43', 'user-44', 'user-45']);
        expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
    });

    it('replaces updated user', async () => {
        await renderLoadedPage();

        fireEvent.click(screen.getByRole('button', { name: 'Update user-2' }));

        expect(screen.getByText('user-2: Mincho')).toBeInTheDocument();
        expect(screen.getByText('user-1: Pencho')).toBeInTheDocument();
        expect(getUserIds()).toHaveLength(20);
    });
});