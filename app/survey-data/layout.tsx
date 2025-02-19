import ExploreSurveyNavigation from '@/components/features/ExploreSurveyNavigation';

export default async function ExploreDataLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 overflow-hidden">
                <ExploreSurveyNavigation />
                <div className="w-full px-4 h-full bg-gray-100 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
