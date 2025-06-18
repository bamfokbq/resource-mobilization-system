import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSurveyById } from "@/actions/surveyActions";
import { FaArrowLeft, FaBuilding, FaEnvelope, FaInfoCircle, FaMapMarkerAlt, FaProjectDiagram, FaCalendarAlt, FaUser } from "react-icons/fa";
import { RiSurveyLine, RiFileTextLine } from "react-icons/ri";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SurveyPage({
  params,
}: {
    params: Promise<{ id: string }>
}) {
  const { id } = (await params);

  const result = await getSurveyById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const survey = result.data;
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'submitted': 'bg-green-100 text-green-800 border-green-200',
      'draft': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'pending': 'bg-blue-100 text-blue-800 border-blue-200',
      'inactive': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/surveys">
            <Button variant="ghost" className="gap-2 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-300">
              <FaArrowLeft className="h-4 w-4" />
              Back to Surveys
            </Button>
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Survey Details
            </h1>
            <p className="text-gray-600 mt-1">View comprehensive survey information</p>
          </div>
        </div>
        <Badge className={`${getStatusBadge(survey.status)} border hover:bg-none px-4 py-2 text-sm font-medium rounded-xl`}>
          {survey.status === 'submitted' ? 'Completed' : survey.status}
        </Badge>
      </div>

      {/* Project Title Card */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
            <RiSurveyLine className="text-blue-600 h-8 w-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">
              {survey.projectInfo?.projectName || 'Untitled Project'}
            </h2>
            <p className="text-gray-500 mt-1">Survey ID: #{survey._id.slice(-8).toUpperCase()}</p>
          </div>
        </div>
      </div>      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Organisation Information Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100">
              <FaBuilding className="text-blue-600 h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Organisation Information</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <FaBuilding className="text-blue-500 h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Organisation</p>
                <p className="text-base font-semibold text-gray-800">
                  {survey.organisationInfo?.organisationName || 'Not specified'}
                </p>
                {survey.organisationInfo?.sector && (
                  <p className="text-sm text-gray-500 mt-1">
                    Sector: {survey.organisationInfo.sector}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <FaMapMarkerAlt className="text-green-500 h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Region</p>
                <p className="text-base font-semibold text-gray-800">
                  {survey.organisationInfo?.region || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <FaEnvelope className="text-purple-500 h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Contact Email</p>
                <p className="text-base font-semibold text-gray-800">
                  {survey.organisationInfo?.email || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Information Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100">
              <RiFileTextLine className="text-blue-600 h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Project Information</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-lg bg-white shadow-sm mt-1">
                <FaInfoCircle className="text-blue-500 h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                <p className="text-base text-gray-700 leading-relaxed">
                  {survey.projectInfo?.projectDescription || 'No description provided'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <FaCalendarAlt className="text-orange-500 h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Project Duration</p>
                <p className="text-base font-semibold text-gray-800">
                  {survey.projectInfo?.startDate ? formatDate(survey.projectInfo.startDate) : 'Not specified'}
                  {survey.projectInfo?.endDate && ` - ${formatDate(survey.projectInfo.endDate)}`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-lg bg-white shadow-sm mt-1">
                <FaProjectDiagram className="text-indigo-500 h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Targeted NCDs</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {survey.projectInfo?.targetedNCDs?.length ? (
                    survey.projectInfo.targetedNCDs.map((ncd: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs px-3 py-1 rounded-full">
                        {ncd}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-base text-gray-700">Not specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Survey Metadata Card */}
      <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100">
            <FaInfoCircle className="text-blue-600 h-5 w-5" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Survey Metadata</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <FaUser className="text-blue-500 h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-1">Submitted By</p>
              <p className="text-base font-semibold text-gray-800">
                {survey.createdBy.name || survey.createdBy.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {survey.createdBy.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <FaCalendarAlt className="text-green-500 h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-1">Submission Date</p>
              <p className="text-base font-semibold text-gray-800">
                {formatDate(survey.submissionDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 rounded-lg bg-white shadow-sm">
              <RiSurveyLine className="text-purple-500 h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-1">Survey Status</p>
              <Badge className={`${getStatusBadge(survey.status)} border-0 px-3 py-1 text-xs font-medium rounded-full`}>
                {survey.status === 'submitted' ? 'Completed' : survey.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
