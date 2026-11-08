import { describe, expect, it } from 'vitest';

import { ROLE_LABELS } from './roles';

describe('ROLE_LABELS', () => {
    it('maps each role to its label', () => {
        expect(ROLE_LABELS).toEqual({ student: 'Student', teacher: 'Teacher', admin: 'Admin' });
    });
});