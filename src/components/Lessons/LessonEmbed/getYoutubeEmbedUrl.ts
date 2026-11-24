// Converts a YouTube video URL into an embeddable iframe src.
// Returns null for anything else (e.g. Vimeo), so it can fall back to a plain link.
export const getYoutubeEmbedUrl = (videoUrl: string): string | null => {
    let parsed: URL;

    try {
        parsed = new URL(videoUrl);
    } catch {
        return null;
    }

    if (parsed.hostname === 'youtu.be') {
        const videoId = parsed.pathname.slice(1);
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (!parsed.hostname.endsWith('youtube.com')) {
        return null;
    }

    if (parsed.pathname === '/watch') {
        const videoId = parsed.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (parsed.pathname === '/playlist') {
        const listId = parsed.searchParams.get('list');
        return listId ? `https://www.youtube.com/embed/videoseries?list=${listId}` : null;
    }

    if (parsed.pathname.startsWith('/embed/')) {
        return videoUrl;
    }

    return null;
};