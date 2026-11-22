import TestTimer from './TestTimer';

interface TestHeaderProps {
    title: string;
    sectionLabel: string;
    moduleLabel: string;
    secondsRemaining?: number;
    onExit: () => void;
}

const TestHeader = ({ title, sectionLabel, moduleLabel, secondsRemaining, onExit }: TestHeaderProps) => {
    return (
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 sm:px-10">
            <div>
                <span className="block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                    {moduleLabel ? `${sectionLabel} · ${moduleLabel}` : sectionLabel}
                </span>
                <h1 className="font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                    {title}
                </h1>
            </div>

            <div>
                {secondsRemaining !== undefined && <TestTimer secondsRemaining={secondsRemaining} />}
            </div>

            <button
                type="button"
                onClick={onExit}
                className="justify-self-end rounded-xl border-2 border-slate-200 px-4 py-2 text-sm font-bold text-[#5A6B7B] transition hover:border-red-200 hover:text-red-600"
            >
                Exit test
            </button>
        </div>
    );
};

export default TestHeader;