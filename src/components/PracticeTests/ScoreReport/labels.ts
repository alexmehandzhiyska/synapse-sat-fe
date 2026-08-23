import type { SectionName } from '../../../types/practiceTest';

export const SECTION_LABELS: Record<SectionName, string> = {
    reading_writing: 'Reading and Writing',
    math: 'Math',
};

export const SECTION_COLORS: Record<SectionName, string> = {
    reading_writing: '#2f61c9',
    math: '#eb6834',
};

export const DOMAIN_LABELS: Record<string, string> = {
    information_and_ideas: 'Information and Ideas',
    craft_and_structure: 'Craft and Structure',
    expression_of_ideas: 'Expression of Ideas',
    standard_english_conventions: 'Standard English Conventions',
    algebra: 'Algebra',
    advanced_math: 'Advanced Math',
    problem_solving_and_data_analysis: 'Problem Solving and Data Analysis',
    geometry_and_trigonometry: 'Geometry and Trigonometry',
};

// Shorter labels so domain names stay legible in charts
export const SHORT_DOMAIN_LABELS: Record<string, string> = {
    information_and_ideas: 'Info & Ideas',
    craft_and_structure: 'Craft & Struct',
    expression_of_ideas: 'Expression',
    standard_english_conventions: 'Eng Conventions',
    algebra: 'Algebra',
    advanced_math: 'Adv Math',
    problem_solving_and_data_analysis: 'Problem-Solving',
    geometry_and_trigonometry: 'Geometry',
};