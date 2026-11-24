import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import TestHeader from './TestHeader';

const renderHeader = (moduleLabel: string) => {
    const onExit = vi.fn();
    render(<TestHeader title="Test 1" sectionLabel="Math" moduleLabel={moduleLabel} onExit={onExit} />);

    return { onExit };
};

describe('TestHeader', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders title', () => {
        renderHeader('Module 1');

        expect(screen.getByRole('heading', { name: 'Test 1' })).toBeInTheDocument();
    });

    it('renders section and module label', () => {
        renderHeader('Module 1');

        expect(screen.getByText('Math · Module 1')).toBeInTheDocument();
    });

    it('renders only section label without module', () => {
        renderHeader('');

        expect(screen.getByText('Math')).toBeInTheDocument();
    });

    it('calls onExit when exit is clicked', () => {
        const { onExit } = renderHeader('Module 1');

        fireEvent.click(screen.getByRole('button', { name: 'Exit test' }));

        expect(onExit).toHaveBeenCalledTimes(1);
    });
});