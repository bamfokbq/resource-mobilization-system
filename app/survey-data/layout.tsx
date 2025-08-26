import ExploreSurveyNavigation from '@/components/features/ExploreSurveyNavigation';
import { SurveyDataFilterProvider } from '@/components/providers/SurveyDataFilterProvider';
import { GlobalFilterBar } from '@/components/shared/GlobalFilterBar';
import { Suspense } from 'react';

function GlobalFilterBarWrapper() {
    return (
        <Suspense fallback={<div className="h-32 bg-gray-100 animate-pulse border-b" />}>
            <GlobalFilterBar />
        </Suspense>
    );
}

export default async function ExploreDataLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-1 overflow-hidden">
                <ExploreSurveyNavigation />
                <div className="w-full h-full bg-gray-100 overflow-auto">
                    <Suspense fallback={
                        <div className="space-y-4 p-6">
                            <div className="h-32 bg-gray-200 animate-pulse rounded" />
                            <div className="h-64 bg-gray-200 animate-pulse rounded" />
                        </div>
                    }>
                        <SurveyDataFilterProvider>
                            <GlobalFilterBarWrapper />
                            <div className="px-4 py-2">
                                {children}
                            </div>
                        </SurveyDataFilterProvider>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
