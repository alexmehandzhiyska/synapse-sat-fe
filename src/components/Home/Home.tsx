const Home = () => {
    return (
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
    );
};

export default Home;
