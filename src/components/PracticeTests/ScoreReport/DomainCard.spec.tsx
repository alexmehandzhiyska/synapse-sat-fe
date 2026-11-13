import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import DomainCard from './DomainCard';

const renderCard = (correct: number, total: number) => {
    const { container } = render(<DomainCard domain={{ domain: 'algebra', correct, total }} />);

    return { bar: container.querySelector('.bg-\\[\\#2f61c9\\]') as HTMLElement };
};

describe('DomainCard', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders domain label', () => {
        renderCard(3, 4);

        expect(screen.getByRole('heading', { name: 'Algebra' })).toBeInTheDocument();
    });

    it('renders correct out of total', () => {
        renderCard(3, 4);

        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('/ 4')).toBeInTheDocument();
    });

    it('fills bar by rounded accuracy', () => {
        const { bar } = renderCard(2, 3);

        expect(bar).toHaveStyle({ width: '67%' });
    });

    it('leaves bar empty when domain has no questions', () => {
        const { bar } = renderCard(0, 0);

        expect(bar).toHaveStyle({ width: '0%' });
    });
});