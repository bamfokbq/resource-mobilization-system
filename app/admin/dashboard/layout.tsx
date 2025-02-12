'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import AdminDashboardLinks from '@/components/features/AdminDashboardLinks'
import Header from '@/components/shared/Header'

export default function AdminDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col h-screen">
            <Header variant="admin" />
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