import { ScrollArea } from "@/components/ui/scroll-area"
import Header from '@/components/shared/Header'
import UserDashboardLinks from '@/components/features/UserDashboardLinks';

export default function UserDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
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
    )
}