import { useLocation } from "react-router-dom";

import Header from "./Header/Header";

interface LayoutProps {
    children: React.ReactNode
}

// Path prefixes for screens that render their own header and hide the app header.
const HEADERLESS_PATHS = ['/practice-tests/'];

const Layout = ({ children }: LayoutProps) => {
    const { pathname } = useLocation();
    const hideHeader = HEADERLESS_PATHS.some((path) => pathname.startsWith(path));

    return (
        <>
            {!hideHeader && <Header></Header>}
            <main>
                {children}
            </main>
        </>
    );
}

export default Layout;