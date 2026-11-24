import { describe, expect, it } from 'vitest';

import { getYoutubeEmbedUrl } from './getYoutubeEmbedUrl';

describe('getYoutubeEmbedUrl', () => {
    it('converts watch url to embed', () => {
        expect(getYoutubeEmbedUrl('https://www.youtube.com/watch?v=video-1')).toBe('https://www.youtube.com/embed/video-1');
    });

    it('converts watch url without www to embed', () => {
        expect(getYoutubeEmbedUrl('https://youtube.com/watch?v=video-1')).toBe('https://www.youtube.com/embed/video-1');
    });

    it('converts youtu.be url to embed', () => {
        expect(getYoutubeEmbedUrl('https://youtu.be/video-1')).toBe('https://www.youtube.com/embed/video-1');
    });

    it('converts playlist url to embed', () => {
        expect(getYoutubeEmbedUrl('https://www.youtube.com/playlist?list=list-1')).toBe('https://www.youtube.com/embed/videoseries?list=list-1');
    });

    it('keeps embed url unchanged', () => {
        expect(getYoutubeEmbedUrl('https://www.youtube.com/embed/video-1')).toBe('https://www.youtube.com/embed/video-1');
    });

    it('returns null for watch url without video id', () => {
        expect(getYoutubeEmbedUrl('https://www.youtube.com/watch')).toBeNull();
    });

    it('returns null for youtu.be url without video id', () => {
        expect(getYoutubeEmbedUrl('https://youtu.be/')).toBeNull();
    });

    it('returns null for playlist url without list id', () => {
        expect(getYoutubeEmbedUrl('https://www.youtube.com/playlist')).toBeNull();
    });

    it('returns null for other youtube page', () => {
        expect(getYoutubeEmbedUrl('https://www.youtube.com/@channel')).toBeNull();
    });

    it('returns null for non-youtube url', () => {
        expect(getYoutubeEmbedUrl('https://vimeo.com/123')).toBeNull();
    });

    it('returns null for invalid url', () => {
        expect(getYoutubeEmbedUrl('not-a-url')).toBeNull();
    });
});