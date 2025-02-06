import Header from '@/components/shared/Header';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>
            <Header />
            {children}
        </section>
    );
}
