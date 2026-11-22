import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import authService from '../../services/authService';
import practiceTestService from '../../services/practiceTestService';
import type { AuthUser, UserRole } from '../../types/auth';
import type { PracticeTest, PracticeTestType } from '../../types/practiceTest';
import PracticeTestsList from './PracticeTestsList';

vi.mock('../../services/authService', () => ({
    default: { getCurrentUser: vi.fn() },
}));

vi.mock('../../services/practiceTestService', () => ({
    default: { getAll: vi.fn(), remove: vi.fn() },
}));

const createTest = (id: string, title: string, type: PracticeTestType): PracticeTest => ({
    id,
    title,
    type,
    domain: null,
    createdAt: '2027-01-10T12:00:00Z',
    updatedAt: '2027-01-10T12:00:00Z',
});

const tests = [
    createTest('test-1', 'Test 1', 'diagnostic'),
    createTest('test-2', 'Test 2', 'standard'),
];

const logInAs = (role: UserRole) => {
    vi.mocked(authService.getCurrentUser).mockReturnValue({ role } as AuthUser);
};

const renderList = () => {
    render(
        <MemoryRouter>
            <PracticeTestsList />
        </MemoryRouter>,
    );
};

const renderLoadedList = async () => {
    renderList();

    await screen.findByRole('heading', { name: 'Test 1' });
};

const getTestCard = (title: string) => within(screen.getByRole('heading', { name: title }).closest('article') as HTMLElement);
const getModal = () => within(screen.getByRole('heading', { name: 'Delete practice test?' }).parentElement as HTMLElement);

const openDeleteConfirm = (title: string) => {
    fireEvent.click(getTestCard(title).getByRole('button', { name: 'Delete' }));
};

const confirmDelete = (title: string) => {
    openDeleteConfirm(title);
    fireEvent.click(getModal().getByRole('button', { name: 'Delete' }));
};

describe('PracticeTestsList', () => {
    beforeEach(() => {
        logInAs('student');
        vi.mocked(practiceTestService.getAll).mockReset().mockResolvedValue(tests);
        vi.mocked(practiceTestService.remove).mockReset().mockResolvedValue();
    });

    afterEach(() => {
        cleanup();
    });

    it('shows placeholders while loading', () => {
        vi.mocked(practiceTestService.getAll).mockReturnValue(new Promise(() => {}));

        renderList();

        expect(screen.getByLabelText('Loading practice tests')).toBeInTheDocument();
    });

    it('shows error when loading fails', async () => {
        vi.mocked(practiceTestService.getAll).mockRejectedValue(new Error('Server error'));

        renderList();

        expect(await screen.findByRole('heading', { name: 'We couldn\'t load the tests' })).toBeInTheDocument();
        expect(screen.getByText('Error loading practice tests. Try again later')).toBeInTheDocument();
    });

    it('shows empty state without tests', async () => {
        vi.mocked(practiceTestService.getAll).mockResolvedValue([]);

        renderList();

        expect(await screen.findByRole('heading', { name: 'No practice tests yet' })).toBeInTheDocument();
    });

    it('renders tests with type', async () => {
        await renderLoadedList();

        expect(getTestCard('Test 1').getByText('diagnostic · Digital SAT')).toBeInTheDocument();
        expect(getTestCard('Test 2').getByText('standard · Digital SAT')).toBeInTheDocument();
    });

    it('links student to custom packet builder', async () => {
        await renderLoadedList();

        expect(screen.getByRole('link', { name: 'Build custom packet' })).toHaveAttribute('href', '/practice-tests/custom-packet');
        expect(screen.queryByRole('link', { name: 'Add practice test' })).not.toBeInTheDocument();
    });

    it('links student to start each test', async () => {
        await renderLoadedList();

        expect(getTestCard('Test 1').getByRole('link', { name: 'Start test' })).toHaveAttribute('href', '/practice-tests/test-1');
        expect(getTestCard('Test 2').getByRole('link', { name: 'Start test' })).toHaveAttribute('href', '/practice-tests/test-2');
        expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
    });

    it('shows only start test links when logged out', async () => {
        vi.mocked(authService.getCurrentUser).mockReturnValue(null);

        await renderLoadedList();

        expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual(['Start test', 'Start test']);
    });

    it('links teacher to add practice test', async () => {
        logInAs('teacher');

        await renderLoadedList();

        expect(screen.getByRole('link', { name: 'Add practice test' })).toHaveAttribute('href', '/practice-tests/add');
        expect(screen.queryByRole('link', { name: 'Build custom packet' })).not.toBeInTheDocument();
    });

    it('links teacher to add and review questions for each test', async () => {
        logInAs('teacher');

        await renderLoadedList();

        expect(getTestCard('Test 1').getByRole('link', { name: 'Add questions' })).toHaveAttribute('href', '/practice-tests/test-1/questions/add');
        expect(getTestCard('Test 1').getByRole('link', { name: 'Review questions' })).toHaveAttribute('href', '/practice-tests/test-1/review');
        expect(getTestCard('Test 1').queryByRole('link', { name: 'Start test' })).not.toBeInTheDocument();
    });

    it('asks teacher to confirm before deleting', async () => {
        logInAs('teacher');
        await renderLoadedList();

        openDeleteConfirm('Test 1');

        expect(getModal().getByText('Delete "Test 1"? This also removes all of its questions and any student results for it.')).toBeInTheDocument();
        expect(practiceTestService.remove).not.toHaveBeenCalled();
    });

    it('closes confirmation on cancel', async () => {
        logInAs('teacher');
        await renderLoadedList();
        openDeleteConfirm('Test 1');

        fireEvent.click(getModal().getByRole('button', { name: 'Cancel' }));

        expect(screen.queryByRole('heading', { name: 'Delete practice test?' })).not.toBeInTheDocument();
        expect(practiceTestService.remove).not.toHaveBeenCalled();
    });

    it('deletes test after confirming', async () => {
        logInAs('teacher');
        await renderLoadedList();

        confirmDelete('Test 1');

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: 'Test 1' })).not.toBeInTheDocument();
        });

        expect(practiceTestService.remove).toHaveBeenCalledWith('test-1');
        expect(screen.getByRole('heading', { name: 'Test 2' })).toBeInTheDocument();
    });

    it('shows deleting state while deleting', async () => {
        vi.mocked(practiceTestService.remove).mockReturnValue(new Promise(() => {}));
        logInAs('teacher');
        await renderLoadedList();

        confirmDelete('Test 1');

        expect(getTestCard('Test 1').getByRole('button', { name: 'Deleting...' })).toBeDisabled();
        expect(getTestCard('Test 2').getByRole('button', { name: 'Delete' })).toBeEnabled();
    });

    it('shows error above tests when deleting fails', async () => {
        vi.mocked(practiceTestService.remove).mockRejectedValue(new Error('Could not delete test'));
        logInAs('teacher');
        await renderLoadedList();

        confirmDelete('Test 1');

        expect(await screen.findByText('Could not delete test')).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'We couldn\'t load the tests' })).not.toBeInTheDocument();
        expect(getTestCard('Test 1').getByRole('button', { name: 'Delete' })).toBeEnabled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(practiceTestService.remove).mockRejectedValue('error');
        logInAs('teacher');
        await renderLoadedList();

        confirmDelete('Test 1');

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });
});