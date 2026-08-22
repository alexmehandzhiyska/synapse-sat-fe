import type { Difficulty, Domain, SectionName } from '../../../types/practiceTest';

export const DOMAINS_BY_SECTION: Record<SectionName, Domain[]> = {
    reading_writing: [
        'information_and_ideas',
        'craft_and_structure',
        'expression_of_ideas',
        'standard_english_conventions',
    ],
    math: [
        'algebra',
        'advanced_math',
        'problem_solving_and_data_analysis',
        'geometry_and_trigonometry',
    ]
};

export const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
];

export const CHOICE_LABELS = ['A', 'B', 'C', 'D'];