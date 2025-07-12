import { AlertCircle } from 'lucide-react'
import { ErrorResult } from '@/types/dashboard'

interface ErrorStatesSectionProps {
    analyticsResult: ErrorResult
    performanceResult: ErrorResult
    dashboardStatsResult: ErrorResult
    surveysResult: ErrorResult
}

export default function ErrorStatesSection({ 
    analyticsResult, 
    performanceResult, 
    dashboardStatsResult, 
    surveysResult 
}: ErrorStatesSectionProps) {
    // Only render if there are any errors
    const hasErrors = !analyticsResult.success || !performanceResult.success || 
                     !dashboardStatsResult.success || !surveysResult.success

    if (!hasErrors) {
        return null
    }

    return (
        <div className="space-y-4">
            {!analyticsResult.success && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-red-200">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-red-500" size={24} />
                        <h3 className="text-lg font-semibold text-red-700">Analytics Error</h3>
                    </div>
                    <p className="text-red-600">{analyticsResult.message}</p>
                    <p className="text-sm text-gray-600 mt-2">Please check your database connection and try again.</p>
                </div>
            )}

            {!performanceResult.success && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-200">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-yellow-600" size={24} />
                        <h3 className="text-lg font-semibold text-yellow-700">Performance Metrics Error</h3>
                    </div>
                    <p className="text-yellow-700">{performanceResult.message}</p>
                    <p className="text-sm text-gray-600 mt-2">System performance data is temporarily unavailable.</p>
                </div>
            )}

            {!dashboardStatsResult.success && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-200">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-orange-600" size={24} />
                        <h3 className="text-lg font-semibold text-orange-700">Dashboard Stats Error</h3>
                    </div>
                    <p className="text-orange-700">{dashboardStatsResult.message}</p>
                    <p className="text-sm text-gray-600 mt-2">Dashboard statistics are temporarily unavailable.</p>
                </div>
            )}

            {!surveysResult.success && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="text-purple-600" size={24} />
                        <h3 className="text-lg font-semibold text-purple-700">Survey Data Error</h3>
                    </div>
                    <p className="text-purple-700">{surveysResult.message}</p>
                    <p className="text-sm text-gray-600 mt-2">Unable to load survey data at this time.</p>
                </div>
            )}
        </div>
    )
}
