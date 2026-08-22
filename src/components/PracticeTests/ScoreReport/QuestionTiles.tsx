import type { QuestionResult, QuestionStatus } from '../../../types/score';

const STATUS_CLASSES: Record<QuestionStatus, string> = {
    correct: 'border-emerald-500 bg-emerald-500',
    incorrect: 'border-red-500 bg-red-500',
    omitted: 'border-dashed border-slate-300 bg-transparent',
};

interface QuestionTilesProps {
    questions: QuestionResult[];
    onSelectQuestion: (question: QuestionResult) => void;
}

const QuestionTiles = ({ questions, onSelectQuestion }: QuestionTilesProps) => {
    return (
        <div className="flex flex-wrap gap-1">
            {questions.map((question) => (
                <button
                    key={question.position}
                    type="button"
                    onClick={() => onSelectQuestion(question)}
                    title={`Question ${question.position}: ${question.status}`}
                    className={`h-4 w-4 rounded border-2 transition hover:scale-125 ${STATUS_CLASSES[question.status]}`}
                />
            ))}
        </div>
    );
};

export default QuestionTiles;