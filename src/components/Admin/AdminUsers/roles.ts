import type { UserRole } from '../../../types/auth';

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'admin', label: 'Admin' },
];

export const ROLE_LABELS: Record<UserRole, string> = Object.fromEntries(
    ROLE_OPTIONS.map((option) => [option.value, option.label]),
) as Record<UserRole, string>;
