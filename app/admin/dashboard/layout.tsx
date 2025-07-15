import { ScrollArea } from "@/components/ui/scroll-area"
import AdminDashboardLinks from '@/components/features/AdminDashboardLinks'
import Header from '@/components/shared/Header'
import { auth } from '@/auth';
import { redirect } from 'next/navigation'

export default async function AdminDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    // Immediate redirects without loading screens
    if (!session) {
        redirect('/admin');
    }

    const role = session?.user?.role;

    if (!role || role !== 'Admin') {
        redirect('/dashboard');
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