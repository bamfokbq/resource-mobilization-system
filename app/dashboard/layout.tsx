import { ScrollArea } from "@/components/ui/scroll-area"
import Header from '@/components/shared/Header'
import UserDashboardLinks from '@/components/features/UserDashboardLinks';
import UserProvider from '@/components/providers/UserProvider';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function UserDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    if (!session) {
        return redirect('/auth/signin');
    }

    const role = session?.user?.role;

    if (role && role !== 'User') {
        return redirect('/admin/dashboard');
    } return (
        <UserProvider user={session?.user || null}>
            <div className="flex flex-col h-screen">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <UserDashboardLinks />
                    <ScrollArea className="flex-1 bg-gray-100">
                        <div className="w-full h-full bg-gray-100">
                            <div className="p-4">
                                {children}
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </UserProvider>
    )
}