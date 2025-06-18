import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSurveyById } from "@/actions/surveyActions";
import { FaArrowLeft, FaBuilding, FaEnvelope, FaInfoCircle, FaMapMarkerAlt, FaProjectDiagram, FaCalendarAlt, FaUser } from "react-icons/fa";
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-5xl mx-auto space-y-8 p-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/surveys">
            <Button variant="ghost" className="gap-2 hover:bg-muted">
              <FaArrowLeft className="h-4 w-4" />
              Back to Surveys
            </Button>
          </Link>
        </div>        <div className="flex items-center gap-2 text-2xl pb-4 border-b border-border">
          <div className="p-2.5 rounded-full bg-navy-blue/10">
            <FaProjectDiagram className="text-navy-blue h-7 w-7" />
          </div>
          <span className="flex-1 text-foreground font-semibold">
            {survey.projectInfo?.projectName || 'Untitled Project'}
          </span>
          <Badge className={`${getStatusBadge(survey.status)} border hover:bg-none ml-2 px-4 py-1.5 text-sm font-medium`}>
            {survey.status === 'submitted' ? 'Completed' : survey.status}
          </Badge>
        </div>        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-background p-6 rounded-xl space-y-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-foreground mb-4">Organisation Information</h3>

            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaBuilding className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Organisation</p>
                <p className="text-base font-semibold text-foreground">
                  {survey.organisationInfo?.organisationName || 'Not specified'}
                </p>
                {survey.organisationInfo?.sector && (
                  <p className="text-sm text-muted-foreground">
                    Sector: {survey.organisationInfo.sector}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaMapMarkerAlt className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Region</p>
                <p className="text-base font-semibold text-foreground">
                  {survey.organisationInfo?.region || 'Not specified'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaEnvelope className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Contact Email</p>
                <p className="text-base font-semibold text-foreground">
                  {survey.organisationInfo?.email || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-background p-6 rounded-xl space-y-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-foreground mb-4">Project Information</h3>

            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaInfoCircle className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                <p className="text-base text-foreground/90 leading-relaxed">
                  {survey.projectInfo?.projectDescription || 'No description provided'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaCalendarAlt className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Project Duration</p>
                <p className="text-base font-semibold text-foreground">
                  {survey.projectInfo?.startDate ? formatDate(survey.projectInfo.startDate) : 'Not specified'}
                  {survey.projectInfo?.endDate && ` - ${formatDate(survey.projectInfo.endDate)}`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaProjectDiagram className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Targeted NCDs</p>
                <div className="flex flex-wrap gap-2 mt-2">                  {survey.projectInfo?.targetedNCDs?.length ? (
                  survey.projectInfo.targetedNCDs.map((ncd: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {ncd}
                    </Badge>
                  ))
                ) : (
                  <span className="text-base text-foreground/90">Not specified</span>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-foreground mb-4">Survey Metadata</h3>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaUser className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Submitted By</p>
                <p className="text-base font-semibold text-foreground">
                  {survey.createdBy.name || survey.createdBy.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {survey.createdBy.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaCalendarAlt className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Submission Date</p>
                <p className="text-base font-semibold text-foreground">
                  {formatDate(survey.submissionDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaInfoCircle className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Survey ID</p>
                <p className="text-base font-semibold text-foreground font-mono">
                  #{survey._id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
