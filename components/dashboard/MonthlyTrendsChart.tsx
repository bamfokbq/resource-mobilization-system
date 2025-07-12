import { DashboardStats } from '@/types/dashboard'

interface MonthlyTrendsChartProps {
    monthlyTrends: DashboardStats['monthlyTrends']
}

export default function MonthlyTrendsChart({ monthlyTrends }: MonthlyTrendsChartProps) {
    const maxSurveys = Math.max(...monthlyTrends.map(m => m.surveys), 1)
    const maxDrafts = Math.max(...monthlyTrends.map(m => m.drafts), 1)

    return (
        <div className="bg-white rounded-xl p-6 shadow-lg overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Trends</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4 min-w-[300px]">
                {monthlyTrends.map((month, index) => (
                    <div key={index} className="text-center min-w-0">
                        <div className="mb-2">
                            <div className="w-full bg-gray-200 rounded-full h-16 sm:h-24 flex flex-col justify-end relative">
                                <div
                                    className="bg-blue-600 rounded-b-full"
                                    style={{
                                        height: `${Math.max((month.surveys / maxSurveys) * 100, 5)}%`
                                    }}
                                ></div>
                                <div
                                    className="bg-yellow-500 rounded-b-full absolute bottom-0 w-full opacity-70"
                                    style={{
                                        height: `${Math.max((month.drafts / maxDrafts) * 50, 3)}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-600 font-medium truncate">{month.month}</div>
                        <div className="text-xs text-blue-600">{month.surveys} surveys</div>
                        <div className="text-xs text-yellow-600">{month.drafts} drafts</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
