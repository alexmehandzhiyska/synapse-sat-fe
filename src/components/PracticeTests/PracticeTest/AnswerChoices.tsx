import type { AnswerChoice } from '../../../types/practiceTest';

interface AnswerChoicesProps {
    choices: AnswerChoice[];
    selectedChoiceId: string | null;
    onSelect: (choiceId: string) => void;
}

const AnswerChoices = ({ choices, selectedChoiceId, onSelect }: AnswerChoicesProps) => {
    return (
        <div className="space-y-3">
            {choices.map((choice) => {
                const isSelected = choice.id === selectedChoiceId;

                return (
                    <button
                        key={choice.id}
                        type="button"
                        onClick={() => onSelect(choice.id)}
                        className={`flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3 text-left transition ${
                            isSelected
                                ? 'border-[#2f61c9] bg-blue-50'
                                : 'border-slate-200 bg-white hover:border-blue-200'
                        }`}
                    >
                        <span
                            className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 text-sm font-extrabold ${
                                isSelected
                                    ? 'border-[#2f61c9] bg-[#2f61c9] text-white'
                                    : 'border-slate-300 text-[#13385A]'
                            }`}
                        >
                            {choice.label}
                        </span>
                        <span className="text-base font-semibold text-[#1b1b1f]">
                            {choice.content}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default AnswerChoices;