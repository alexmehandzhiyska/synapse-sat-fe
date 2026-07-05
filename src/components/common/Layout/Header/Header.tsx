const navItems = [
    { label: 'Courses', href: '/courses' },
    { label: 'Practice tests', href: '/practice-tests' },
    { label: 'About Us', href: '/about-us' },
];

const Header = () => {
    return (
        <header className="sticky border-b border-[#e7e5e4] bg-[#EBE9E4]/90">
            <div className="flex items-center justify-between bg-white px-10 py-3">
                <a href="/">
                    <div className="text-2xl font-bold leading-none text-black">
                        SynapseSAT
                    </div>

                    <div className="text-[0.62em] font-bold uppercase tracking-[0.25em] text-[#0070E0]">
                        SAT Prep Academy
                    </div>
                </a>

                <nav className="absolute left-1/2 -translate-x-1/2 text-black">
                    {navItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="relative mx-2 py-2 px-3 text-sm font-bold transition hover:text-stone-950 after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-stone-950 after:transition-transform hover:after:scale-x-100"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <a
                        href="/register"
                        className="relative px-3 py-2 text-sm font-bold text-black transition after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-stone-950 after:transition-transform hover:after:scale-x-100"
                    >
                        Register
                    </a>

                    <a
                        href="/login"
                        className="relative px-3 py-2 text-sm font-bold text-black transition hover:text-stone-950 after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-stone-950 after:transition-transform hover:after:scale-x-100"
                    >
                        Login
                    </a>

                    <a
                        href="/get-started"
                        className="rounded-lg bg-[#0070E0] px-3 py-2 text-sm font-bold text-white shadow-[0_10px_25px_rgba(0,0,0,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0063C6] hover:shadow-[0_15px_30px_#00000038]"
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;