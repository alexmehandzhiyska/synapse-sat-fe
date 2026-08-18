import type { DomainScore } from '../../../types/score';
import { DOMAIN_LABELS } from './labels';

interface DomainCardProps {
    domain: DomainScore;
}

const DomainCard = ({ domain }: DomainCardProps) => {
    const percent = domain.total === 0 ? 0 : Math.round((domain.correct / domain.total) * 100);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h5 className="text-xs font-bold text-[#13385A]">{DOMAIN_LABELS[domain.domain]}</h5>
            <p className="mt-1.5 font-['Space_Grotesk'] text-xl font-extrabold text-[#13385A]">
                {domain.correct}
                <span className="ml-1 text-xs font-bold text-[#5A6B7B]">/ {domain.total}</span>
            </p>
            <div className="mt-2.5 h-1.5 rounded-full bg-slate-200">
                <div className="h-1.5 rounded-full bg-[#2f61c9]" style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
};

export default DomainCard;