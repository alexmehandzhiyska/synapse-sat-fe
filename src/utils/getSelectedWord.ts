export interface SelectedWord {
    word: string;
    context: string;
}

// A word is letters, optionally joined by apostrophes or hyphens
const WORD_PATTERN = /^[A-Za-z]+(['-][A-Za-z]+)*$/;

const getSentence = (text: string, offset: number): string => {
    const sentences = new Intl.Segmenter('en', { granularity: 'sentence' }).segment(text);
    return sentences.containing(offset)?.segment.trim() ?? '';
};

const getSelectedWord = (): SelectedWord | null => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
        return null;
    }

    const word = selection.toString().trim();

    if (!WORD_PATTERN.test(word)) {
        return null;
    }

    const range = selection.getRangeAt(0);
    const text = range.startContainer.textContent ?? '';

    return { word, context: getSentence(text, range.startOffset) };
};

export default getSelectedWord;