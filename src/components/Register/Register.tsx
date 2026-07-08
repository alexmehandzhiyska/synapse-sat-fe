const Register = () => {
    return (
        <section className="min-h-[calc(100vh-97px)] w-full bg-white px-8 py-6 sm:px-10 lg:px-16 lg:py-7 xl:px-20">
            <div className="mx-auto grid max-w-6xl items-center gap-9 lg:grid-cols-[1fr_0.9fr] xl:gap-12">
                <div>
                    <div className="mb-4 inline-flex items-center rounded-4xl bg-blue-100 px-4 py-2">
                        <span className="mr-5 h-1.25 w-1.25 rounded-[50%] bg-blue-900"></span>
                        <p className="text-sm text-blue-900">Start with a smarter SAT system</p>
                    </div>

                    <h1 className="mb-4 font-['Space_Grotesk'] text-3xl font-extrabold leading-tight text-[#13385A] xl:text-5xl">
                        Create an Account
                    </h1>

                    <p className="max-w-xl text-base font-medium leading-7 text-[#5A6B7B]">
                        Build a personal study path with diagnostic practice, adaptive study plan,
                        and clear score tracking from day one.
                    </p>
                </div>

                <div className="w-full max-w-140 justify-self-center rounded-3xl border border-gray-100 bg-white p-7 shadow-[0_24px_70px_rgba(19,56,90,0.12)] md:p-8 lg:justify-self-end">
                    <div className="mb-5">
                        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.35em] text-[#2f61c9]">
                            Register
                        </p>
                        <h2 className="font-['Space_Grotesk'] text-2xl font-extrabold text-[#1b1b1f]">
                            Join SynapseSAT
                        </h2>
                    </div>

                    <form className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block pt-1">
                                <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                    First name
                                </span>
                                <input
                                    type="text"
                                    name="firstName"
                                    autoComplete="given-name"
                                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    placeholder="Pencho"
                                />
                            </label>

                            <label className="block pt-1">
                                <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                    Last name
                                </span>
                                <input
                                    type="text"
                                    name="lastName"
                                    autoComplete="family-name"
                                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    placeholder="Minchov"
                                />
                            </label>
                        </div>

                        <label className="block pt-1">
                            <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                Email address
                            </span>
                            <input
                                type="email"
                                name="email"
                                autoComplete="email"
                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                placeholder="pen4o@gmail.com"
                            />
                        </label>

                        <label className="block pt-1">
                            <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                Password
                            </span>
                            <input
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                placeholder="Create a password"
                            />
                        </label>

                        <label className="block pt-1">
                            <span className="mb-2 block text-xs font-extrabold text-[#1b1b1f]">
                                Confirm password
                            </span>
                            <input
                                type="password"
                                name="confirmPassword"
                                autoComplete="new-password"
                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 text-sm font-semibold text-[#1b1b1f] outline-none transition focus:border-[#2f61c9] focus:bg-white focus:ring-4 focus:ring-blue-100"
                                placeholder="Confirm your password"
                            />
                        </label>

                        <button
                            type="submit"
                            className="my-8 flex h-12 w-full items-center justify-center rounded-2xl bg-[#2f61c9] px-10 text-sm font-extrabold text-white transition-all duration-300 hover:bg-[#244fa8]"
                        >
                            Create account
                        </button>
                    </form>

                    <p className="mt-3 text-center text-xs font-semibold text-[#71717a]">
                        Already have an account?{' '}
                        <a href="/login" className="font-extrabold text-[#2f61c9] hover:text-[#244fa8]">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Register;
