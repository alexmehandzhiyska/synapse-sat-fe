import { useState } from 'react';

import type { Difficulty } from '../../../types/practiceTest';
import type { ModuleScore, QuestionResult, SectionScore } from '../../../types/score';
import { DOMAIN_LABELS } from './labels';

interface QuestionDetailsTableProps {
    section: SectionScore;
    onSelectQuestion: (question: QuestionResult) => void;
}

type Row = { module: ModuleScore; question: QuestionResult };
type SortField = 'module' | 'correctness' | 'difficulty' | 'domain';
type SortDirection = 'asc' | 'desc';

const getChoiceLabel = (question: QuestionResult, choiceId: string | null): string | null => {
    if (!choiceId) {
        return null;
    }

    return question.answerChoices.find((choice) => choice.id === choiceId)?.label ?? null;
};

const getCorrectChoiceLabel = (question: QuestionResult): string | null => {
    return question.answerChoices.find((choice) => choice.isCorrect)?.label ?? null;
};

const ANSWER_CLASSES: Record<QuestionResult['status'], string> = {
    correct: 'text-emerald-700',
    incorrect: 'text-red-600',
    omitted: 'text-[#13385A]',
};

const RESULT_LABELS: Record<QuestionResult['status'], string> = {
    correct: 'Correct',
    incorrect: 'Incorrect',
    omitted: 'Omit',
};

const RESULT_BADGE_CLASSES: Record<QuestionResult['status'], string> = {
    correct: 'bg-emerald-50 text-emerald-700',
    incorrect: 'bg-red-50 text-red-600',
    omitted: 'bg-slate-100 text-[#5A6B7B]',
};

const STATUS_ORDER: Record<QuestionResult['status'], number> = {
    incorrect: 0,
    correct: 1,
    omitted: 2,
};

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
    easy: 0,
    medium: 1,
    hard: 2,
};

const compareRows = (a: Row, b: Row, field: SortField): number => {
    switch (field) {
        case 'module':
            return a.module.position - b.module.position;
        case 'correctness':
            return STATUS_ORDER[a.question.status] - STATUS_ORDER[b.question.status];
        case 'difficulty':
            return DIFFICULTY_ORDER[a.question.difficulty] - DIFFICULTY_ORDER[b.question.difficulty];
        case 'domain':
            return DOMAIN_LABELS[a.question.domain].localeCompare(DOMAIN_LABELS[b.question.domain]);
    }
};

const SortArrow = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 10 10" className={className} fill="currentColor">
        <path d="M5 1L9 9H1Z" />
    </svg>
);

type SortableHeaderProps = {
    field: SortField;
    label: string;
    sortField: SortField | null;
    sortDirection: SortDirection;
    onSort: (field: SortField) => void;
}

const SortableHeader = ({ field, label, sortField, sortDirection, onSort }: SortableHeaderProps) => {
    const isActive = sortField === field;

    return (
        <button
            type="button"
            onClick={() => onSort(field)}
            className={`inline-flex items-center gap-1.5 uppercase ${isActive ? 'text-[#2f61c9]' : ''}`}
        >
            {label}
            <SortArrow
                className={`h-2.5 w-2.5 ${isActive && sortDirection === 'desc' ? 'rotate-180' : ''} ${isActive ? 'text-[#2f61c9]' : 'text-slate-300'}`}
            />
        </button>
    );
};

const QuestionDetailsTable = ({ section, onSelectQuestion }: QuestionDetailsTableProps) => {
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const rows: Row[] = [];

    for (const module of section.modules) {
        for (const question of module.questions) {
            rows.push({ module, question });
        }
    }

    const sortedRows = sortField
        ? [...rows].sort((a, b) => {
            const comparison = compareRows(a, b, sortField);
            return sortDirection === 'asc' ? comparison : -comparison;
        })
        : rows;

    const handleSort = (field: SortField) => {
        if (sortField !== field) {
            setSortField(field);
            setSortDirection('asc');
            return;
        }

        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    return (
        <div className="mt-6 max-h-105 overflow-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-160 text-left text-sm">
                <thead>
                    <tr className="text-center text-xs font-extrabold uppercase tracking-wide text-[#5A6B7B]">
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
                            <SortableHeader field="module" label="Module" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                        </th>
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">Question</th>
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
                            <SortableHeader field="correctness" label="Result" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                        </th>
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">Correct answer</th>
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">Your answer</th>
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
                            <SortableHeader field="difficulty" label="Difficulty" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                        </th>
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">
                            <SortableHeader field="domain" label="Domain" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedRows.map(({ module, question }) => (
                        <tr
                            key={question.id}
                            onClick={() => onSelectQuestion(question)}
                            className="cursor-pointer border-b border-slate-100 transition last:border-0 hover:bg-[#f4f7fb]"
                        >
                            <td className="px-4 py-3 text-center font-semibold text-[#13385A]">{module.position}</td>
                            <td className="px-4 py-3 text-center font-semibold text-[#13385A]">{question.position}</td>
                            <td className="px-4 py-3 text-center">
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${RESULT_BADGE_CLASSES[question.status]}`}>
                                    {RESULT_LABELS[question.status]}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-[#13385A]">
                                {getCorrectChoiceLabel(question) ?? '—'}
                            </td>
                            <td className={`px-4 py-3 text-center font-bold ${ANSWER_CLASSES[question.status]}`}>
                                {question.status === 'omitted'
                                    ? 'Omitted'
                                    : getChoiceLabel(question, question.selectedChoiceId) ?? '—'}
                            </td>
                            <td className="px-4 py-3 capitalize text-[#5A6B7B]">{question.difficulty}</td>
                            <td className="px-4 py-3 text-[#5A6B7B]">{DOMAIN_LABELS[question.domain]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuestionDetailsTable;