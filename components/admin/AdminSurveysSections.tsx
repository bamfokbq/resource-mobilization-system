
import { getAllSurveys } from '@/actions/surveyActions'
import AdminSurveyList from '@/components/tables/AdminSurveyList'
import { RiFileList2Line, RiUserLine, RiCalendarLine, RiCheckboxCircleLine } from 'react-icons/ri'


export async function AdminSurveysStatsSection() {
    const surveysResult = await getAllSurveys()
    const surveys = surveysResult.success ? surveysResult.data : []
    
    // Calculate stats
    const totalSurveys = surveys?.length || 0
    const completedSurveys = surveys?.filter(survey => survey.status === 'completed')?.length || 0
    const draftSurveys = surveys?.filter(survey => survey.status === 'draft')?.length || 0
    const activeSurveys = surveys?.filter(survey => survey.status === 'active')?.length || 0
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <RiFileList2Line className="text-blue-600" size={20} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Total Mappings</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalSurveys}</div>
                <div className="text-xs text-gray-500 mt-1">All survey submissions</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <RiCheckboxCircleLine className="text-green-600" size={20} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Completed</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{completedSurveys}</div>
                <div className="text-xs text-gray-500 mt-1">Finished surveys</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <RiCalendarLine className="text-orange-600" size={20} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Active</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{activeSurveys}</div>
                <div className="text-xs text-gray-500 mt-1">In progress</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <RiUserLine className="text-gray-600" size={20} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Drafts</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{draftSurveys}</div>
                <div className="text-xs text-gray-500 mt-1">Incomplete surveys</div>
            </div>
        </div>
    )
}

export async function AdminSurveysTableSection() {
    const surveysResult = await getAllSurveys()
    
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
                <RiFileList2Line className="text-blue-500 text-2xl" />
                <h2 className="text-2xl font-bold text-gray-800">All Survey Submissions</h2>
            </div>
            <AdminSurveyList initialData={surveysResult} />
        </div>
    )
}
