import type { QuestionResult, SectionScore } from '../../../types/score';
import { DOMAIN_LABELS } from './labels';

interface QuestionDetailsTableProps {
    section: SectionScore;
    onSelectQuestion: (question: QuestionResult) => void;
}

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

const QuestionDetailsTable = ({ section, onSelectQuestion }: QuestionDetailsTableProps) => {
    const rows = section.modules.flatMap((module) =>
        module.questions.map((question) => ({ module, question })),
    );

    return (
        <div className="mt-6 max-h-105 overflow-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-160 text-left text-sm">
                <thead>
                    <tr className="text-center text-xs font-extrabold uppercase tracking-wide text-[#5A6B7B]">
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">Module</th>
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">Question</th>
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">Correct answer</th>
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">Your answer</th>
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">Difficulty</th>
                        <th className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3">Domain</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ module, question }) => (
                        <tr
                            key={question.id}
                            onClick={() => onSelectQuestion(question)}
                            className="cursor-pointer border-b border-slate-100 transition last:border-0 hover:bg-[#f4f7fb]"
                        >
                            <td className="px-4 py-3 text-center font-semibold text-[#13385A]">{module.position}</td>
                            <td className="px-4 py-3 text-center font-semibold text-[#13385A]">{question.position}</td>
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