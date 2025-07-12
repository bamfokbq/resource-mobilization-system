import { DashboardStats } from '@/types/dashboard'

interface TopRegionsAndSectorsProps {
    dashboardStats: DashboardStats
}

export default function TopRegionsAndSectors({ dashboardStats }: TopRegionsAndSectorsProps) {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Regions</h3>
                <div className="space-y-3">
                    {dashboardStats.topRegions.map((region, index) => (
                        <div key={region.region} className="flex items-center justify-between min-w-0">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                                </div>
                                <span className="font-medium text-gray-900 truncate">{region.region}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${Math.min((region.count / dashboardStats.totalSurveys) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-600">{region.count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Sectors</h3>
                <div className="space-y-3">
                    {dashboardStats.topSectors.map((sector, index) => (
                        <div key={sector.sector} className="flex items-center justify-between min-w-0">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                                </div>
                                <span className="font-medium text-gray-900 truncate">{sector.sector}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: `${Math.min((sector.count / dashboardStats.totalSurveys) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-600">{sector.count}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
