const Home = () => {
    const steps = [
        {
            number: '1',
            title: 'Diagnose',
            description: "An adaptive baseline test maps exactly what you know and don't.",
        },
        {
            number: '2',
            title: 'Recall',
            description: 'Active retrieval practice - the most proven way to learn.',
        },
        {
            number: '3',
            title: 'Space',
            description: "Weak spots resurface right before you'd forget them.",
        },
        {
            number: '4',
            title: 'Calibrate',
            description: 'Full-length, timed practice tests under real test conditions.',
        },
    ];

    const stats = [
        {
            value: '+190',
            label: 'avg. point gain',
        },
        {
            value: '90%',
            label: 'hit their target',
        },
        {
            value: '2x',
            label: 'better retention',
        },
        {
            value: '1480',
            label: 'median final score',
        },
    ];

    return (
        <>
            <section className="flex flex-col h-[90vh] w-3/5 mx-auto justify-center items-center">
                <div className="flex justify-between items-center rounded-4xl w-auto mb-4 px-4 py-2 bg-blue-100">
                    <span className="w-1.25 h-1.25 mr-5 rounded-[50%] bg-blue-900"></span>
                    <p className="text-blue-900">Learning skills, not test tricks</p>
                </div>
                <h1 className="text-7xl font-['Space_Grotesk'] font-extrabold text-[#13385A] text-center mb-8">Prep smarter for the digital SAT</h1>
                <p className="text-lg font-medium text-[#5A6B7B] text-center my-8">High-quality practice questions that mirror the real exam, with clear explanations and full-length tests that simulate test day.</p>

                <div className="flex">
                    <button className="btn btn-primary">Take a diagnostic test</button>
                    <button className="btn btn-secondary">How it works</button>
                </div>
            </section>

            <section className="w-full px-6 py-28">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <p className="mb-6 text-sm font-extrabold uppercase tracking-[0.35em] text-[#2f61c9]">How it works</p>
                        <h2 className="font-['Space_Grotesk'] text-5xl font-extrabold leading-tight text-[#1b1b1f] ">Four steps, grounded in research.</h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                        {steps.map((step) => (
                            <article key={step.number} className="min-h-72 rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_0_0_1px_rgba(17,24,39,0.02)]">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl font-extrabold text-[#2f61c9]">
                                    {step.number}
                                </div>
                                <h3 className="mb-6 font-['Space_Grotesk'] text-xl font-extrabold text-[#1b1b1f]">{step.title}</h3>
                                <p className="text-md font-semibold leading-8 text-[#71717a]">{step.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="w-full bg-[#191a1e] px-6 py-24 text-white">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-20 text-center">
                        <p className="mb-6 text-sm font-extrabold uppercase tracking-[0.35em] text-[#91afe5]">The evidence</p>
                        <h2 className="font-['Space_Grotesk'] text-5xl font-extrabold leading-tight">Measured, not guessed.</h2>
                    </div>

                    <div className="grid gap-12 text-center sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <p className="mb-5 font-['Space_Grotesk'] text-6xl font-extrabold leading-none lg:text-7xl">{stat.value}</p>
                                <p className="text-lg font-bold text-[#a3a3aa]">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            <section className="w-full px-6 py-24 text-center">
                <div className="mx-auto max-w-4xl">
                    <h2 className="mb-8 font-['Space_Grotesk'] text-5xl font-extrabold leading-tight text-[#1b1b1f]">See where you stand today.</h2>
                    <p className="mb-8 text-xl font-semibold text-[#71717a]">Free full diagnostic practice test.</p>
                    <button className="inline-flex h-16 min-w-48 items-center justify-center rounded-2xl bg-[#2f61c9] px-10 text-xl font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8]">
                        Take the diagnostic&nbsp;→
                    </button>
                </div>
            </section>
        </>
    );
};

export default Home;
