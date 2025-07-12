import SurveyListTable from '@/components/tables/SurveyListTable'
import { TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { FaProjectDiagram } from 'react-icons/fa'

export default function SurveyManagementSection() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                        <FaProjectDiagram className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Survey List
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Browse and manage available surveys
                        </p>
                    </div>
                </div>
                <Link
                    href="/admin/dashboard/surveys"
                    className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2"
                >
                    View All <TrendingUp size={16} />
                </Link>
            </div>
            <Suspense fallback={
                <div className="space-y-4 animate-pulse">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="grid grid-cols-4 gap-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            }>
                <SurveyListTable />
            </Suspense>
        </div>
    )
}
