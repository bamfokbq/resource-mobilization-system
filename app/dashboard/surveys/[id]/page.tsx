import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SURVEY_HISTORY_LISTS } from "@/constant";
import { FaArrowLeft, FaBuilding, FaEnvelope, FaInfoCircle, FaMapMarkerAlt, FaProjectDiagram } from "react-icons/fa";
import Link from "next/link";

export default async function SurveyPage({
  params,
}: {
  params: Promise<{ id: number }>
}) {
  const { id } = (await params);
  const survey = SURVEY_HISTORY_LISTS.find(data => data.id === Number(id));

  if (!survey) {
    return <div>Survey not found</div>;
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completed': 'bg-blue-100 text-blue-800 border-blue-200',
      'inactive': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
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
        </div>

        <div className="flex items-center gap-2 text-2xl pb-4 border-b border-border">
          <div className="p-2.5 rounded-full bg-navy-blue/10">
            <FaProjectDiagram className="text-navy-blue h-7 w-7" />
          </div>
          <span className="flex-1 text-foreground font-semibold">{survey.project_name}</span>
          <Badge className={`${getStatusBadge(survey.status)} border hover:bg-none ml-2 px-4 py-1.5 text-sm font-medium`}>
            {survey.status}
          </Badge>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-background p-6 rounded-xl space-y-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaBuilding className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Organisation</p>
                <p className="text-base font-semibold text-foreground">{survey.organisation}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaMapMarkerAlt className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Region</p>
                <p className="text-base font-semibold text-foreground">{survey.region}</p>
              </div>
            </div>
          </div>

          <div className="bg-background p-6 rounded-xl space-y-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaInfoCircle className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                <p className="text-base text-foreground/90 leading-relaxed">
                  {survey.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-lg bg-navy-blue/10">
                <FaEnvelope className="text-navy-blue h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">Contact</p>
                <p className="text-base font-semibold text-foreground">{survey.contact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
