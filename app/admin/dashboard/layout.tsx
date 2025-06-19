import { ScrollArea } from "@/components/ui/scroll-area"
import AdminDashboardLinks from '@/components/features/AdminDashboardLinks'
import Header from '@/components/shared/Header'
import AdminLoadingScreen from '@/components/shared/AdminLoadingScreen'
import RedirectLoadingScreen from '@/components/shared/RedirectLoadingScreen'
import { auth } from '@/auth';
import { redirect } from 'next/navigation'

export default async function AdminDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    if (!session) {
        return (
            <>
                <RedirectLoadingScreen type="login" />
                {redirect('/admin')}
            </>
        );
    }
    const role = session?.user?.role;

    if (role && role !== 'Admin') {
        return (
            <>
                <RedirectLoadingScreen type="dashboard" />
                {redirect('/dashboard')}
            </>
        );
    }

    // Show loading screen while role is being verified
    if (!role) {
        return <AdminLoadingScreen />;
    }

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <AdminDashboardLinks />
                <ScrollArea className="flex-1 bg-gray-100">
                    <div className="w-full h-full bg-gray-100">
                        <div className="p-4">
                            {children}
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}