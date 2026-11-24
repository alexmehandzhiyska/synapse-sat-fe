import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import ModuleCompletionInterstitial from './ModuleCompletionInterstitial';

describe('ModuleCompletionInterstitial', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders completion message', () => {
        render(<ModuleCompletionInterstitial />);

        expect(screen.getByRole('heading', { name: 'This module is over' })).toBeInTheDocument();
        expect(screen.getByText('All your work has been saved.')).toBeInTheDocument();
        expect(screen.getByText("You'll move on automatically in just a moment.")).toBeInTheDocument();
    });
});