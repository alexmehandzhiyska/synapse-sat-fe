import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import practiceTestService from '../../../services/practiceTestService';
import type { Difficulty, Domain, GenerateCustomPacketData, QuestionStatusFilter, SectionName } from '../../../types/practiceTest';
import { DIFFICULTY_OPTIONS, DOMAINS_BY_SECTION } from '../AddQuestion/domains';
import { DOMAIN_LABELS, SECTION_LABELS } from '../ScoreReport/labels';

const SECTION_OPTIONS: SectionName[] = ['reading_writing', 'math'];

const STATUS_OPTIONS: { value: QuestionStatusFilter; label: string }[] = [
    { value: 'correct', label: 'Answered correctly' },
    { value: 'incorrect', label: 'Answered incorrectly' },
    { value: 'unsolved', label: 'Never attempted' },
];

const TOGGLE_BASE_CLASS = 'rounded-xl border-2 px-5 py-2.5 text-sm font-bold transition';
const TOGGLE_SELECTED_CLASS = 'border-[#2f61c9] bg-blue-50 text-[#13385A]';
const TOGGLE_UNSELECTED_CLASS = 'border-slate-200 bg-white text-[#5A6B7B] hover:border-blue-200';

function toggleValue<T>(list: T[], value: T): T[] {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

const CustomPacketBuilder = () => {
    const navigate = useNavigate();

    const [section, setSection] = useState<SectionName>('reading_writing');
    const [domains, setDomains] = useState<Domain[]>([]);
    const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
    const [statuses, setStatuses] = useState<QuestionStatusFilter[]>([]);
    const [count, setCount] = useState(10);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleSectionChange = (nextSection: SectionName) => {
        setSection(nextSection);
        setDomains([]);
    };

    const handleGenerate = async () => {
        setError('');
        setIsGenerating(true);

        const data: GenerateCustomPacketData = { section, domains, difficulties, statuses, count };

        try {
            const packet = await practiceTestService.generateCustomPacket(data);
            navigate(`/practice-tests/${packet.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
            setIsGenerating(false);
        }
    };

    return (
        <section className="min-h-[calc(100vh-73px)] bg-[#f4f7fb] px-6 py-12 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-3xl">
                <h1 className="mb-3 font-['Space_Grotesk'] text-4xl font-extrabold leading-tight text-[#13385A] sm:text-5xl">
                    Build a custom packet
                </h1>
                <p className="mb-9 text-lg font-semibold leading-8 text-[#5A6B7B]">
                    Pick a section, then narrow down by domain, difficulty, and how you've done on a question before.
                </p>

                <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(19,56,90,0.06)] sm:p-8">
                    <div>
                        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                            Section
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {SECTION_OPTIONS.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleSectionChange(option)}
                                    className={`${TOGGLE_BASE_CLASS} ${section === option ? TOGGLE_SELECTED_CLASS : TOGGLE_UNSELECTED_CLASS}`}
                                >
                                    {SECTION_LABELS[option]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                            Domains
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {DOMAINS_BY_SECTION[section].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setDomains((prev) => toggleValue(prev, option))}
                                    className={`${TOGGLE_BASE_CLASS} ${domains.includes(option) ? TOGGLE_SELECTED_CLASS : TOGGLE_UNSELECTED_CLASS}`}
                                >
                                    {DOMAIN_LABELS[option]}
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-xs font-semibold text-[#5A6B7B]">
                            Leave all unselected to include every domain.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                            Difficulty
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {DIFFICULTY_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setDifficulties((prev) => toggleValue(prev, option.value))}
                                    className={`${TOGGLE_BASE_CLASS} ${difficulties.includes(option.value) ? TOGGLE_SELECTED_CLASS : TOGGLE_UNSELECTED_CLASS}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-xs font-semibold text-[#5A6B7B]">
                            Leave all unselected to include every difficulty.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                            Status
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {STATUS_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setStatuses((prev) => toggleValue(prev, option.value))}
                                    className={`${TOGGLE_BASE_CLASS} ${statuses.includes(option.value) ? TOGGLE_SELECTED_CLASS : TOGGLE_UNSELECTED_CLASS}`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-xs font-semibold text-[#5A6B7B]">
                            Leave all unselected to include any status.
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-[#5A6B7B]">
                            How many questions?
                        </h2>
                        <input
                            type="number"
                            min={1}
                            value={count}
                            onChange={(event) => setCount(Math.max(1, Number(event.target.value) || 1))}
                            className="h-12 w-32 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    {error && (
                        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#2f61c9] px-6 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isGenerating ? 'Generating…' : 'Generate packet'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CustomPacketBuilder;