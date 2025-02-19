import ExploreSurveyNavigation from '@/components/features/ExploreSurveyNavigation';
import { ScrollArea } from '@/components/ui/scroll-area';

export default async function ExploreDataLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 overflow-hidden">
                <ExploreSurveyNavigation />
                <ScrollArea className="flex-1 bg-gray-100">
                    <div className="w-full h-full bg-gray-100">
                        <div className="p-4">
                            {children}
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
