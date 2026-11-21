import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import practiceTestService from '../../../services/practiceTestService';
import AddPracticeTest from './AddPracticeTest';

const navigate = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => ({
    ...(await importOriginal<typeof import('react-router-dom')>()),
    useNavigate: () => navigate,
}));

vi.mock('../../../services/practiceTestService', () => ({
    default: { create: vi.fn() },
}));

const renderForm = () => {
    render(
        <MemoryRouter>
            <AddPracticeTest />
        </MemoryRouter>,
    );
};

const getTypeSelect = () => screen.getByLabelText('Type');
const getDomainSelect = () => screen.queryByLabelText('Domain');
const getOptionLabels = (select: HTMLElement) => Array.from((select as HTMLSelectElement).options).map((option) => option.textContent);

const changeField = (label: string, value: string) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
};

const submit = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Create test' }));
};

describe('AddPracticeTest', () => {
    beforeEach(() => {
        navigate.mockReset();
        
        vi.mocked(practiceTestService.create).mockReset().mockResolvedValue({
            id: 'test-1',
            title: 'Test 1',
            type: 'standard',
            domain: null,
            createdAt: '2027-01-10T12:00:00Z',
            updatedAt: '2027-01-10T12:00:00Z',
        });
    });

    afterEach(() => {
        cleanup();
    });

    it('defaults to standard type', () => {
        renderForm();

        expect(getTypeSelect()).toHaveValue('standard');
        expect(getOptionLabels(getTypeSelect())).toEqual(['Standard', 'Diagnostic', 'Check-in']);
    });

    it('hides domain for standard test', () => {
        renderForm();

        expect(getDomainSelect()).not.toBeInTheDocument();
    });

    it('hides domain for diagnostic test', () => {
        renderForm();

        changeField('Type', 'diagnostic');

        expect(getDomainSelect()).not.toBeInTheDocument();
    });

    it('shows all domains for check-in test', () => {
        renderForm();

        changeField('Type', 'check_in');

        expect(getDomainSelect()).toHaveValue('');
        expect(getOptionLabels(getDomainSelect() as HTMLElement)).toEqual([
            'Select a domain',
            'Information and Ideas',
            'Craft and Structure',
            'Expression of Ideas',
            'Standard English Conventions',
            'Algebra',
            'Advanced Math',
            'Problem Solving and Data Analysis',
            'Geometry and Trigonometry',
        ]);
    });

    it('shows required error for empty title', async () => {
        renderForm();

        submit();

        expect(await screen.findByText('Title is required')).toBeInTheDocument();
        expect(practiceTestService.create).not.toHaveBeenCalled();
    });

    it('shows error for title longer than 200 characters', async () => {
        renderForm();

        changeField('Title', 'a'.repeat(201));
        submit();

        expect(await screen.findByText('Title must be at most 200 characters')).toBeInTheDocument();
        expect(practiceTestService.create).not.toHaveBeenCalled();
    });

    it('shows required error for check-in test without domain', async () => {
        renderForm();

        changeField('Title', 'Test 1');
        changeField('Type', 'check_in');
        submit();

        expect(await screen.findByText('Select a domain', { selector: 'span' })).toBeInTheDocument();
        expect(practiceTestService.create).not.toHaveBeenCalled();
    });

    it('creates standard test', async () => {
        renderForm();

        changeField('Title', 'Test 1');
        submit();

        await waitFor(() => {
            expect(practiceTestService.create).toHaveBeenCalledWith({ title: 'Test 1', type: 'standard' });
        });
    });

    it('creates check-in test with domain', async () => {
        renderForm();

        changeField('Title', 'Test 1');
        changeField('Type', 'check_in');
        changeField('Domain', 'algebra');
        submit();

        await waitFor(() => {
            expect(practiceTestService.create).toHaveBeenCalledWith({ title: 'Test 1', type: 'check_in', domain: 'algebra' });
        });
    });

    it('navigates to add questions after creating', async () => {
        renderForm();

        changeField('Title', 'Test 1');
        submit();

        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/practice-tests/test-1/questions/add');
        });
    });

    it('shows creating state while submitting', async () => {
        vi.mocked(practiceTestService.create).mockReturnValue(new Promise(() => {}));
        renderForm();

        changeField('Title', 'Test 1');
        submit();

        expect(await screen.findByRole('button', { name: 'Creating...' })).toBeDisabled();
    });

    it('shows error message when creating fails', async () => {
        vi.mocked(practiceTestService.create).mockRejectedValue(new Error('Could not create test'));
        renderForm();

        changeField('Title', 'Test 1');
        submit();

        expect(await screen.findByText('Could not create test')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create test' })).toBeEnabled();
        expect(navigate).not.toHaveBeenCalled();
    });

    it('shows fallback error for non-error rejection', async () => {
        vi.mocked(practiceTestService.create).mockRejectedValue('error');
        renderForm();

        changeField('Title', 'Test 1');
        submit();

        expect(await screen.findByText('Something went wrong.')).toBeInTheDocument();
    });
});