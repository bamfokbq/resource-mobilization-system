import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSurveyById } from "@/actions/surveyActions";
import { FaArrowLeft, FaBuilding, FaEnvelope, FaInfoCircle, FaMapMarkerAlt, FaProjectDiagram, FaCalendarAlt, FaUser, FaUsers, FaDollarSign, FaHandshake, FaExclamationTriangle, FaLeaf, FaChartLine, FaClipboardCheck, FaStickyNote, FaGlobe, FaPhone, FaMapPin } from "react-icons/fa";
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

  console.log("Survey Details Result:", result);


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

            {survey.organisationInfo?.website && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <FaGlobe className="text-cyan-500 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Website</p>
                  <a
                    href={survey.organisationInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-blue-600 hover:text-blue-800 underline"
                  >
                    {survey.organisationInfo.website}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <FaPhone className="text-orange-500 h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Phone Numbers</p>
                <div className="space-y-1">
                  {survey.organisationInfo?.hqPhoneNumber && (
                    <p className="text-base font-semibold text-gray-800">
                      HQ: {survey.organisationInfo.hqPhoneNumber}
                    </p>
                  )}
                  {survey.organisationInfo?.regionalPhoneNumber && (
                    <p className="text-base font-semibold text-gray-800">
                      Regional: {survey.organisationInfo.regionalPhoneNumber}
                    </p>
                  )}
                  {!survey.organisationInfo?.hqPhoneNumber && !survey.organisationInfo?.regionalPhoneNumber && (
                    <p className="text-base text-gray-700">Not specified</p>
                  )}
                </div>
              </div>
            </div>

            {survey.organisationInfo?.hasRegionalOffice && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <FaBuilding className="text-indigo-500 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Regional Office</p>
                  <p className="text-base font-semibold text-gray-800">
                    {survey.organisationInfo.regionalOfficeLocation || 'Not specified'}
                  </p>
                </div>
              </div>
            )}

            {survey.organisationInfo?.ghanaPostGPS && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <FaMapPin className="text-red-500 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Ghana Post GPS</p>
                  <p className="text-base font-semibold text-gray-800">
                    {survey.organisationInfo.ghanaPostGPS}
                  </p>
                </div>
              </div>
            )}
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

            {survey.projectInfo?.totalProjects && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <FaProjectDiagram className="text-blue-500 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Projects</p>
                  <p className="text-base font-semibold text-gray-800">
                    {survey.projectInfo.totalProjects}
                  </p>
                </div>
              </div>
            )}

            {survey.projectInfo?.projectGoal && (
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-white shadow-sm mt-1">
                  <FaProjectDiagram className="text-green-500 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Project Goal</p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {survey.projectInfo.projectGoal}
                  </p>
                </div>
              </div>
            )}

            {survey.projectInfo?.projectObjectives && (
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-white shadow-sm mt-1">
                  <FaClipboardCheck className="text-purple-500 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Project Objectives</p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {survey.projectInfo.projectObjectives}
                  </p>
                </div>
              </div>
            )}

            {survey.projectInfo?.estimatedBudget && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <FaDollarSign className="text-green-500 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Estimated Budget</p>
                  <p className="text-base font-semibold text-gray-800">
                    {survey.projectInfo.estimatedBudget}
                  </p>
                </div>
              </div>
            )}

            {survey.projectInfo?.fundingSource && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <FaDollarSign className="text-blue-500 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Funding Source</p>
                  <p className="text-base font-semibold text-gray-800">
                    {survey.projectInfo.fundingSource}
                  </p>
                </div>
              </div>
            )}

            {survey.projectInfo?.regions?.length > 0 && (
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-white shadow-sm mt-1">
                  <FaMapMarkerAlt className="text-red-500 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Project Regions</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {survey.projectInfo.regions.map((region: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200 text-xs px-3 py-1 rounded-full">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {survey.projectInfo?.targetBeneficiaries && (
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-white shadow-sm mt-1">
                  <FaUsers className="text-orange-500 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Target Beneficiaries</p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {survey.projectInfo.targetBeneficiaries}
                  </p>
                </div>
              </div>
            )}

            {survey.projectInfo?.projectLocation && (
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg bg-white shadow-sm mt-1">
                  <FaMapMarkerAlt className="text-teal-500 h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">Project Location</p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {survey.projectInfo.projectLocation}
                  </p>
                </div>
              </div>
            )}
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

      {/* Project Activities Card */}
      {survey.projectActivities?.ncdActivities && Object.keys(survey.projectActivities.ncdActivities).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100">
              <FaClipboardCheck className="text-blue-600 h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Project Activities</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(survey.projectActivities.ncdActivities).map(([key, value]: [string, any], index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                {Array.isArray(value) ? (
                  <div className="flex flex-wrap gap-2">
                    {value.map((item: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                        {item}
                      </Badge>
                    ))}
                  </div>
                ) : typeof value === 'object' && value !== null ? (
                  <div className="space-y-3">
                    {Object.entries(value).map(([subKey, subValue]: [string, any], subIdx: number) => (
                      <div key={subIdx} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-medium text-gray-600 capitalize min-w-0 flex-shrink-0">
                            {subKey.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <div className="flex-1 min-w-0">
                            {Array.isArray(subValue) ? (
                              <div className="flex flex-wrap gap-1">
                                {subValue.map((item: string, itemIdx: number) => (
                                  <Badge key={itemIdx} variant="outline" className="text-xs px-2 py-1">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            ) : typeof subValue === 'object' && subValue !== null ? (
                              <span className="text-sm text-gray-700">
                                {JSON.stringify(subValue)}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-700">
                                {String(subValue)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">{String(value)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partners Card */}
      {survey.partners && survey.partners.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100">
              <FaHandshake className="text-blue-600 h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Partners</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {survey.partners.map((partner: any, index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2">
                  {Object.entries(partner).map(([key, value]: [string, any], idx: number) => (
                    <div key={idx}>
                      <span className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="ml-2 text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risks & Sustainability */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-100 to-orange-100">
              <FaExclamationTriangle className="text-red-600 h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Risk Assessment</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500 mb-2">Identified Risks</p>
              <p className="text-gray-700 leading-relaxed">
                {survey.risks || 'No risks identified'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaLeaf className="text-green-500 h-4 w-4" />
                <p className="text-sm font-medium text-gray-500">Sustainability Plan</p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {survey.sustainability || 'No sustainability plan provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Monitoring & Evaluation */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-100 to-green-100">
              <FaChartLine className="text-blue-600 h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Monitoring & Evaluation</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaChartLine className="text-blue-500 h-4 w-4" />
                <p className="text-sm font-medium text-gray-500">Monitoring Plan</p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {survey.monitoringPlan || 'No monitoring plan provided'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaClipboardCheck className="text-green-500 h-4 w-4" />
                <p className="text-sm font-medium text-gray-500">Evaluation Framework</p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {survey.evaluation || 'No evaluation framework provided'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Notes & Version Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notes */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100">
              <FaStickyNote className="text-yellow-600 h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Additional Notes</h3>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {survey.notes || 'No additional notes provided'}
            </p>
          </div>
        </div>

        {/* Version & Update Info */}
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100">
              <FaInfoCircle className="text-purple-600 h-5 w-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Version Information</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <FaInfoCircle className="text-blue-500 h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Version</p>
                <p className="text-base font-semibold text-gray-800">
                  {survey.version || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <FaCalendarAlt className="text-orange-500 h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                <p className="text-base font-semibold text-gray-800">
                  {formatDate(survey.lastUpdated)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
