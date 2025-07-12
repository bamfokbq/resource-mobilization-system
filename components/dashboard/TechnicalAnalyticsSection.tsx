import AdminCharts from '@/components/dashboard/AdminCharts'
import { SystemMetrics } from '@/actions/adminAnalytics'
import { RiBarChartLine } from 'react-icons/ri'

interface TechnicalAnalyticsSectionProps {
    systemMetrics: SystemMetrics | null
}

export default function TechnicalAnalyticsSection({ systemMetrics }: TechnicalAnalyticsSectionProps) {
    if (!systemMetrics) {
        return null
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <RiBarChartLine className="text-purple-600" size={24} />
                    Technical Analytics
                </h2>
                <p className="text-gray-600">Detailed system performance and usage trends</p>
            </div>
            <AdminCharts systemMetrics={systemMetrics} />
        </div>
    )
}
