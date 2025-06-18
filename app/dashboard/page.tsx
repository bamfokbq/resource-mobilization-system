import React from 'react';
import UserStatsCard from '@/components/dashboard/UserStatsCard';
import ActiveSurveyCard from '@/components/dashboard/ActiveSurveyCard';
import SubmittedSurveysTable from '@/components/tables/SubmittedSurveysTable';
import Link from 'next/link';
import { RiSurveyLine, RiCheckboxCircleLine, RiTimeLine } from 'react-icons/ri';
import { getAllSurveys, getUserDraft } from '@/actions/surveyActions';
import { auth } from '@/auth';

export default async function UserDashboardPage() {
  // Get authenticated user session
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">You need to be logged in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  // Fetch all surveys and user draft
  const surveysResult = await getAllSurveys();
  const draftResult = await getUserDraft();

  // Handle errors gracefully
  if (!surveysResult.success) {
    console.error('Failed to fetch surveys:', surveysResult.message);
  }

  // Filter surveys for the current user
  const userSurveys = surveysResult.success && surveysResult.data
    ? surveysResult.data.filter(survey => survey.createdBy?.userId === session?.user?.id)
    : [];

  // Calculate statistics
  const totalSurveys = userSurveys.length;
  const completedSurveys = userSurveys.filter(survey => survey.status === 'submitted').length;
  const inProgressSurveys = draftResult.success ? 1 : 0; // User can only have one draft at a time

  // Prepare active surveys (drafts)
  const activeSurveys = [];
  if (draftResult.success && draftResult.draft) {
    const draft = draftResult.draft;
    const projectName = draft.formData?.projectInfo?.projectName || 'Untitled Survey';
    const lastUpdated = new Date(draft.lastSaved).toLocaleDateString();

    activeSurveys.push({
      id: 'draft',
      title: projectName,
      progress: draft.progress || 0,
      lastUpdated: lastUpdated
    });
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <Link
          href="/dashboard/surveys/form"
          className="bg-navy-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start New Survey
        </Link>
      </div>      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserStatsCard
          title="Total Surveys"
          value={totalSurveys}
          icon={<RiSurveyLine size={24} />}
        />
        <UserStatsCard
          title="Completed"
          value={completedSurveys}
          icon={<RiCheckboxCircleLine size={24} />}
        />
        <UserStatsCard
          title="In Progress"
          value={inProgressSurveys}
          icon={<RiTimeLine size={24} />}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Active Surveys</h2>
        {activeSurveys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSurveys.map((survey) => (
              <ActiveSurveyCard
                key={survey.id}
                id={survey.id}
                title={survey.title}
                progress={survey.progress}
                lastUpdated={survey.lastUpdated}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <RiSurveyLine size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No active surveys found</p>
            <Link
              href="/dashboard/surveys/form"
              className="inline-flex items-center bg-navy-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Your First Survey
            </Link>
            </div>
        )}
      </div>      <div>
        <SubmittedSurveysTable surveys={userSurveys} />
      </div>
    </div>
  );
}
