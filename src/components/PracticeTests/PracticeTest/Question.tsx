import type { Question as QuestionData, SectionName } from '../../../types/practiceTest';
import AnswerChoices from './AnswerChoices';

interface QuestionProps {
    question: QuestionData;
    sectionName: SectionName;
    selectedChoiceId: string | null;
    onSelect: (choiceId: string | null) => void;
}

const Question = ({ question, sectionName, selectedChoiceId, onSelect }: QuestionProps) => {
    const isEnglish = sectionName === 'reading_writing';

    return (
        <div className={isEnglish ? 'grid h-full lg:grid-cols-2' : 'h-full'}>
            {isEnglish && (
                <div className={`h-full overflow-y-auto bg-white p-8 lg:p-12 border-b border-slate-200 lg:border-b-0 lg:border-r`}>
                    <p className="mx-auto max-w-2xl whitespace-pre-line text-lg leading-8 text-[#1b1b1f]">
                        {question.passage}
                    </p>
                </div>
            )}
            <div className="h-full overflow-y-auto bg-white p-8 lg:p-12">
                <div className="mx-auto max-w-2xl">
                    <p
                        className={`mb-6 ${isEnglish ? 'text-lg' : 'text-xl'} font-semibold leading-8 text-[#13385A]`}
                    >
                        {question.prompt}
                    </p>
                    <AnswerChoices
                        choices={question.answerChoices}
                        selectedChoiceId={selectedChoiceId}
                        onSelect={onSelect}
                    />
                </div>
            </div>
        </div>
    );
};

export default Question;