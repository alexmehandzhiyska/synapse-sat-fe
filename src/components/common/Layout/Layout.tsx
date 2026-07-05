import Header from "./Header/Header";

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <Header></Header>
            <main>
                {children}
            </main>
        </>
    );
}

export default Layout;