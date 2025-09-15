import { ScrollArea } from "@/components/ui/scroll-area"
import Header from '@/components/shared/Header'
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    // If not authenticated and not on admin login page, redirect to admin login
    if (!session && children?.toString().includes('AdminLoginForm')) {
        return (
            <section>
                {children}
            </section>
        );
    }

    // If authenticated but not admin role, redirect to user dashboard
    if (session && session.user?.role !== 'Admin') {
        return redirect('/dashboard');
    }

    return (
        <section>
            {children}
        </section>
    );
}
