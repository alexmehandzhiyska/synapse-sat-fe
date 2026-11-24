import { describe, expect, it } from 'vitest';

import { DOMAINS_BY_SECTION, getSectionForDomain } from './domains';

describe('getSectionForDomain', () => {
    it('returns reading_writing for english domains', () => {
        for (const domain of DOMAINS_BY_SECTION.reading_writing) {
            expect(getSectionForDomain(domain)).toBe('reading_writing');
        }
    });

    it('returns math for math domains', () => {
        for (const domain of DOMAINS_BY_SECTION.math) {
            expect(getSectionForDomain(domain)).toBe('math');
        }
    });
});