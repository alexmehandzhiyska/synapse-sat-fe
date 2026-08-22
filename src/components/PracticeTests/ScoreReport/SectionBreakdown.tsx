import type { QuestionResult, SectionScore } from '../../../types/score';
import DomainCard from './DomainCard';
import ModuleCard from './ModuleCard';
import QuestionDetailsTable from './QuestionDetailsTable';
import { SECTION_LABELS } from './labels';

interface SectionBreakdownProps {
    section: SectionScore;
    onSelectQuestion: (question: QuestionResult) => void;
}

const SectionBreakdown = ({ section, onSelectQuestion }: SectionBreakdownProps) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white/60 p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                    {SECTION_LABELS[section.name]}
                </h3>
                <div className="flex items-baseline gap-3">
                    <span className="font-['Space_Grotesk'] text-2xl font-extrabold text-[#2f61c9]">
                        {section.scaled}
                        <span className="ml-1 text-xs font-bold text-[#5A6B7B]">/ 800</span>
                    </span>
                    <span className="rounded-full bg-[#f4f7fb] px-3 py-1 text-xs font-bold text-[#5A6B7B]">
                        {section.raw} / {section.total} correct
                    </span>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {section.modules.map((module) => (
                    <ModuleCard key={module.position} module={module} onSelectQuestion={onSelectQuestion} />
                ))}
            </div>

            <h4 className="mt-6 mb-2 text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                Knowledge and skills
            </h4>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {section.domains.map((domain) => (
                    <DomainCard key={domain.domain} domain={domain} />
                ))}
            </div>

            <h4 className="mt-6 mb-2 text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                Question breakdown
            </h4>
            <QuestionDetailsTable section={section} onSelectQuestion={onSelectQuestion} />
        </div>
    );
};

export default SectionBreakdown;