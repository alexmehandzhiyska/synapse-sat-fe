import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { Lesson } from '../../../types/lesson';
import LessonEmbed from './LessonEmbed';

const youtubeLesson: Lesson = {
    id: 'lesson-1',
    domain: 'algebra',
    title: 'Lesson 1',
    videoUrl: 'https://www.youtube.com/watch?v=video-1',
};

const externalLesson: Lesson = {
    ...youtubeLesson,
    videoUrl: 'https://example.com/lesson-1',
};

const renderEmbed = (lesson: Lesson) => {
    render(<LessonEmbed lesson={lesson} rightContent={<span>Right content</span>} />);
};

const getToggle = () => screen.getByRole('button', { name: /Lesson 1/ });

describe('LessonEmbed', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders collapsed youtube lesson', () => {
        renderEmbed(youtubeLesson);

        expect(getToggle()).toHaveTextContent('Lesson 1 ▸');
        expect(screen.queryByTitle('Lesson 1')).not.toBeInTheDocument();
    });

    it('expands video on click', () => {
        renderEmbed(youtubeLesson);

        fireEvent.click(getToggle());

        expect(getToggle()).toHaveTextContent('Lesson 1 ▾');
        expect(screen.getByTitle('Lesson 1')).toHaveAttribute('src', 'https://www.youtube.com/embed/video-1');
    });

    it('collapses video on second click', () => {
        renderEmbed(youtubeLesson);

        fireEvent.click(getToggle());
        fireEvent.click(getToggle());

        expect(screen.queryByTitle('Lesson 1')).not.toBeInTheDocument();
    });

    it('expands video on enter', () => {
        renderEmbed(youtubeLesson);

        fireEvent.keyDown(getToggle(), { key: 'Enter' });

        expect(screen.getByTitle('Lesson 1')).toBeInTheDocument();
    });

    it('expands video on space', () => {
        renderEmbed(youtubeLesson);

        fireEvent.keyDown(getToggle(), { key: ' ' });

        expect(screen.getByTitle('Lesson 1')).toBeInTheDocument();
    });

    it('ignores other keys', () => {
        renderEmbed(youtubeLesson);

        fireEvent.keyDown(getToggle(), { key: 'Tab' });

        expect(screen.queryByTitle('Lesson 1')).not.toBeInTheDocument();
    });

    it('renders external link for non-youtube lesson', () => {
        renderEmbed(externalLesson);

        const link = screen.getByRole('link', { name: 'Lesson 1 ↗' });

        expect(link).toHaveAttribute('href', 'https://example.com/lesson-1');
        expect(link).toHaveAttribute('target', '_blank');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders right content for youtube lesson', () => {
        renderEmbed(youtubeLesson);

        expect(screen.getByText('Right content')).toBeInTheDocument();
    });

    it('renders right content for non-youtube lesson', () => {
        renderEmbed(externalLesson);

        expect(screen.getByText('Right content')).toBeInTheDocument();
    });
});