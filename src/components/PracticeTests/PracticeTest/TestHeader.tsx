interface TestHeaderProps {
    title: string;
    sectionLabel: string;
    moduleLabel: string;
}

const TestHeader = ({ title, sectionLabel, moduleLabel }: TestHeaderProps) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4 sm:px-10">
            <div>
                <span className="block text-xs font-extrabold uppercase tracking-[0.18em] text-[#2f61c9]">
                    {sectionLabel} · {moduleLabel}
                </span>
                <h1 className="font-['Space_Grotesk'] text-lg font-extrabold text-[#13385A]">
                    {title}
                </h1>
            </div>
        </div>
    );
};

export default TestHeader;