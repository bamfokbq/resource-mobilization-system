import { ScrollArea } from "@/components/ui/scroll-area"
import AdminDashboardLinks from '@/components/features/AdminDashboardLinks'
import Header from '@/components/shared/Header'
import { after } from 'next/server'

export default function AdminDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    after(() => {
        // Execute after the layout is rendered and sent to the user
        console.log('AdminDashboardLayout rendered');
    })

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <AdminDashboardLinks />
                <ScrollArea className="flex-1 p-2 md:p-4 bg-gray-100">
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