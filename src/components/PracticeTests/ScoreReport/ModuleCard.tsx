import type { ModuleScore } from '../../../types/score';
import QuestionTiles from './QuestionTiles';

interface ModuleCardProps {
    module: ModuleScore;
}

const ModuleCard = ({ module }: ModuleCardProps) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-baseline justify-between">
                <h4 className="font-['Space_Grotesk'] text-sm font-extrabold text-[#13385A]">
                    Module {module.position}
                </h4>
                <p className="font-['Space_Grotesk'] text-xl font-extrabold text-[#13385A]">
                    {module.correct}
                    <span className="ml-1 text-xs font-bold text-[#5A6B7B]">/ {module.total}</span>
                </p>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-[#5A6B7B]">
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-emerald-500" />
                    {module.correct} correct
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-red-500" />
                    {module.incorrect} incorrect
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm border-2 border-dashed border-slate-300" />
                    {module.omitted} omitted
                </span>
            </div>

            <div className="mt-3">
                <QuestionTiles questions={module.questions} />
            </div>
        </div>
    );
};

export default ModuleCard;