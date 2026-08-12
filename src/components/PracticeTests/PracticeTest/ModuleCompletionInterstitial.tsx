const ModuleCompletionInterstitial = () => {
    return (
        <section className="flex h-screen flex-col items-center justify-center bg-[#f4f7fb] px-6 text-center">
            <h2 className="mb-6 font-['Space_Grotesk'] text-3xl font-extrabold text-[#13385A] sm:text-4xl">
                This module is over
            </h2>
            <p className="mb-2 text-lg font-semibold text-[#5A6B7B]">
                All your work has been saved.
            </p>
            <p className="mb-2 text-lg font-semibold text-[#5A6B7B]">
                You'll move on automatically in just a moment.
            </p>
            <div className="mt-16 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#2f61c9]" />
        </section>
    );
};

export default ModuleCompletionInterstitial;