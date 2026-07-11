import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faChartLine, faListCheck } from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
    const values = [
        {
            icon: faListCheck,
            title: 'Built for clarity',
            description: 'Students should always know what to study next, why it matters, and how it moves their score.',
        },
        {
            icon: faBullseye,
            title: 'Practice with purpose',
            description: 'Every question is designed to reveal a skill gap, strengthen recall, or build test-day confidence.',
        },
        {
            icon: faChartLine,
            title: 'Progress you can see',
            description: 'SynapseSAT turns performance data into a focused plan instead of leaving students to guess.',
        },
    ];

    return (
        <>
            <section className="flex min-h-[calc(100vh-97px)] w-full items-center bg-white px-8 py-16 sm:px-10 lg:px-16 xl:px-20">
                <div className="mx-auto max-w-5xl text-center">
                    <div className="mb-6 inline-flex items-center rounded-4xl bg-blue-100 px-4 py-2">
                        <span className="mr-5 h-1.25 w-1.25 rounded-[50%] bg-blue-900"></span>
                        <p className="text-sm font-semibold text-blue-900">About SynapseSAT</p>
                    </div>

                    <h1 className="mb-8 font-['Space_Grotesk'] text-5xl font-extrabold leading-tight text-[#13385A] lg:text-7xl">
                        SAT prep that feels less random.
                    </h1>

                    <p className="mx-auto max-w-3xl text-lg font-medium leading-8 text-[#5A6B7B]">
                        SynapseSAT helps students prepare for the digital SAT with targeted practice,
                        clear explanations, and study paths based on real performance. Our goal is
                        simple: make preparation more efficient, less stressful, and ultimately successful.
                    </p>
                </div>
            </section>

            <section className="w-full px-8 py-20 sm:px-10 lg:px-16 xl:px-20">
                <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[0.85fr_1fr]">
                    <div>
                        <p className="mb-5 text-sm font-extrabold uppercase tracking-[0.35em] text-[#2f61c9]">
                            Our Approach
                        </p>
                        <h2 className="font-['Space_Grotesk'] text-4xl font-extrabold leading-tight text-[#1b1b1f]">
                            We combine educational content and targeted practice with a smart feedback loop.
                        </h2>
                    </div>

                    <div className="space-y-6 text-base font-semibold leading-8 text-[#5A6B7B]">
                        <p>
                            Traditional test prep often gives students more work without giving them
                            better direction. SynapseSAT is built around the opposite idea: diagnose
                            the pattern, practice the right skills, reflect on your performance, and keep
                            adjusting the plan as the student improves.
                        </p>
                        <p>
                            We care about durable learning, not memorized tricks. Active
                            recall, spaced review, timed practice, and reflection skills are what matters to us most.
                        </p>
                    </div>
                </div>
            </section>

            <section className="w-full bg-[#191a1e] px-8 py-20 text-white sm:px-10 lg:px-16 xl:px-20">
                <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
                    {values.map((value) => (
                        <article key={value.title} className="rounded-3xl border border-white/10 p-8">
                            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2f61c9]/15 text-[#91afe5]">
                                <FontAwesomeIcon icon={value.icon} className="h-7 w-7" />
                            </div>
                            <h3 className="mb-5 font-['Space_Grotesk'] text-2xl font-extrabold">
                                {value.title}
                            </h3>
                            <p className="font-semibold leading-8 text-[#c7c7ce]">
                                {value.description}
                            </p>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
};

export default AboutUs;
