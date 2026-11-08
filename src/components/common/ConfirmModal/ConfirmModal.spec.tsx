import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ConfirmModal from './ConfirmModal';

const renderModal = (confirmVariant?: 'primary' | 'danger') => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();

    const { container } = render(
        <ConfirmModal
            title="Delete test?"
            message="This cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onCancel={onCancel}
            onConfirm={onConfirm}
            confirmVariant={confirmVariant}
        />,
    );

    return { onCancel, onConfirm, backdrop: container.firstChild as HTMLElement };
};

describe('ConfirmModal', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders title, message and button labels', () => {
        renderModal();

        expect(screen.getByRole('heading', { name: 'Delete test?' })).toBeInTheDocument();
        expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('calls onConfirm when confirm is clicked', () => {
        const { onCancel, onConfirm } = renderModal();

        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onCancel).not.toHaveBeenCalled();
    });

    it('calls onCancel when cancel is clicked', () => {
        const { onCancel, onConfirm } = renderModal();

        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it('calls onCancel when backdrop is clicked', () => {
        const { onCancel, backdrop } = renderModal();

        fireEvent.click(backdrop);

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('does not cancel when clicking inside modal', () => {
        const { onCancel } = renderModal();

        fireEvent.click(screen.getByText('This cannot be undone.'));

        expect(onCancel).not.toHaveBeenCalled();
    });

    it('uses red confirm button for danger variant', () => {
        renderModal('danger');

        expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('bg-red-600');
    });

    it('uses primary confirm button by default', () => {
        renderModal();

        expect(screen.getByRole('button', { name: 'Delete' })).not.toHaveClass('bg-red-600');
    });
});