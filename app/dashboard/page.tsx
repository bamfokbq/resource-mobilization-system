import { getUserSurveys, getPredictiveAnalytics, getSurveyAnalytics, getUserDraft, getUserSurveyStatistics } from '@/actions/surveyActions';
import { auth } from '@/auth';
import ActiveSurveyCard from '@/components/dashboard/ActiveSurveyCard';
import RegionalInsights from '@/components/dashboard/RegionalInsights';
import SurveyMetricsChart from '@/components/dashboard/SurveyMetricsChart';
import UserStatsCard from '@/components/dashboard/UserStatsCard';
import SubmittedSurveysTable from '@/components/tables/SubmittedSurveysTable';
import {
  StatsCardsSkeleton,
  ChartSkeleton,
  RegionalInsightsSkeleton,
  ActiveSurveysSkeleton,
  SubmittedSurveysTableSkeleton
} from '@/components/ui/loading-skeleton';
import Link from 'next/link';
import { Suspense } from 'react';
import { RiBarChartLine, RiCheckboxCircleLine, RiSurveyLine, RiTimeLine } from 'react-icons/ri';

// Generate predictive analytics and milestones (these can remain mock for now as they require ML models)
const generateMockPredictionData = () => {
  const data = [];
  const today = new Date();

  // Historical data (30 days)
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const progress = Math.min(100, 20 + (30 - i) * 2 + Math.random() * 5);
    data.push({
      date: date.toISOString().split('T')[0],
      actual: progress,
      predicted: progress + Math.random() * 2 - 1,
      confidence: {
        lower: Math.max(0, progress - 5),
        upper: Math.min(100, progress + 5)
      },
      target: 20 + (30 - i) * 2.5
    });
  }

  // Future predictions (30 days)
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const predicted = Math.min(100, 82 + i * 0.5 + Math.random() * 3);
    data.push({
      date: date.toISOString().split('T')[0],
      actual: null,
      predicted,
      confidence: {
        lower: Math.max(0, predicted - 8),
        upper: Math.min(100, predicted + 8)
      },
      target: 82 + i * 0.6
    });
  }

  return data;
};

const generateMockMilestones = () => {
  const today = new Date();
  return [
    {
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      label: 'Q2 Target',
      value: 90
    },
    {
      date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      label: 'Final Review',
      value: 95
    },
    {
      date: new Date(today.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      label: 'Project Completion',
      value: 100
    }
  ];
};

// Async component for Stats Cards - Fastest loading
async function StatsCardsSection({ userId }: { userId: string }) {
  // Small delay to demonstrate streaming (remove in production)
  await new Promise(resolve => setTimeout(resolve, 100));

  const userStatsResult = await getUserSurveyStatistics(userId);
  const surveysResult = await getUserSurveys(userId);
  const draftResult = await getUserDraft();

  const userStats = userStatsResult.success ? userStatsResult.data : null;
  const totalSurveys = surveysResult.success ? surveysResult.data?.length || 0 : 0;
  const completedSurveys = surveysResult.success
    ? surveysResult.data?.filter((survey: any) => survey.status === 'submitted').length || 0
    : 0;
  const inProgressSurveys = draftResult.success ? 1 : 0;
  const avgCompletion = userStats?.averageCompletion || (completedSurveys > 0 ? 100 : 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <UserStatsCard
        title="Total Surveys"
        value={totalSurveys}
        icon={<RiSurveyLine size={24} />}
        color="blue"
        trend={{ value: 12, isPositive: true }}
      />
      <UserStatsCard
        title="Completed"
        value={completedSurveys}
        icon={<RiCheckboxCircleLine size={24} />}
        color="green"
        trend={{ value: 8, isPositive: true }}
      />
      <UserStatsCard
        title="In Progress"
        value={inProgressSurveys}
        icon={<RiTimeLine size={24} />}
        color="orange"
      />
      <UserStatsCard
        title="Analytics Score"
        value={`${avgCompletion}%`}
        icon={<RiBarChartLine size={24} />}
        color="purple"
        trend={{ value: 5, isPositive: true }}
      />
    </div>
  );
}

// Async component for Survey Metrics Chart
async function SurveyMetricsSection({ userId }: { userId: string }) {
  // Small delay to demonstrate streaming (remove in production)
  await new Promise(resolve => setTimeout(resolve, 300));

  const [analyticsResult, surveysResult, draftResult] = await Promise.all([
    getSurveyAnalytics(userId),
    getUserSurveys(userId),
    getUserDraft()
  ]);

  const analyticsData = analyticsResult.success ? analyticsResult.data : null;
  const totalSurveys = surveysResult.success ? surveysResult.data?.length || 0 : 0;
  const completedSurveys = surveysResult.success
    ? surveysResult.data?.filter((survey: any) => survey.status === 'submitted').length || 0
    : 0;
  const inProgressSurveys = draftResult.success ? 1 : 0;

  const surveyMetricsData = analyticsData?.surveyMetrics || [
    { month: 'Current', submitted: completedSurveys, draft: inProgressSurveys, total: totalSurveys }
  ];
  const statusData = analyticsData?.statusData || [
    { name: 'Completed', value: completedSurveys, color: '#10B981' },
    { name: 'In Progress', value: inProgressSurveys, color: '#F59E0B' },
    { name: 'Draft', value: inProgressSurveys, color: '#6B7280' }
  ];

  return (
    <SurveyMetricsChart
      data={surveyMetricsData}
      statusData={statusData}
    />
  );
}

// Async component for Regional Insights
async function RegionalInsightsSection({ userId }: { userId: string }) {
  // Small delay to demonstrate streaming (remove in production)
  await new Promise(resolve => setTimeout(resolve, 500));

  const analyticsResult = await getSurveyAnalytics(userId);
  const analyticsData = analyticsResult.success ? analyticsResult.data : null;

  const regionalData = analyticsData?.regionalData || [];
  const effortData = analyticsData?.effortData || [];

  return (
    <RegionalInsights
      regionMetrics={regionalData}
      effortData={effortData}
    />
  );
}

// Async component for Active Surveys
async function ActiveSurveysSection() {
  // Small delay to demonstrate streaming (remove in production)
  await new Promise(resolve => setTimeout(resolve, 400));

  const draftResult = await getUserDraft();

  const activeSurveys = [];
  if (draftResult.success && draftResult.draft) {
    const draft = draftResult.draft;
    const projectName = draft.formData?.projectInfo?.projectName || 'Untitled Survey';
    const lastUpdated = draft.lastSaved
      ? new Date(draft.lastSaved).toLocaleDateString()
      : new Date().toLocaleDateString();

    activeSurveys.push({
      id: 'draft',
      title: projectName,
      progress: draft.progress || 0,
      lastUpdated: lastUpdated
    });
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <RiSurveyLine className="text-blue-500" />
        Active Surveys
      </h2>
      {activeSurveys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-dashed border-blue-300 rounded-xl p-12 text-center">
          <RiSurveyLine size={64} className="mx-auto text-blue-400 mb-6" />
          <h3 className="text-xl font-semibold text-gray-700 mb-3">No active surveys found</h3>
          <p className="text-gray-500 mb-6">Start your first survey to see detailed analytics and insights</p>
          <Link
            href="/dashboard/surveys/form"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <RiSurveyLine className="mr-2" />
            Start Your First Survey
          </Link>
        </div>
      )}
    </div>
  );
}

// Async component for Submitted Surveys Table
async function SubmittedSurveysSection({ userId }: { userId: string }) {
  // Small delay to demonstrate streaming (remove in production)
  await new Promise(resolve => setTimeout(resolve, 700));

  const surveysResult = await getUserSurveys(userId);

  const userSurveys = surveysResult.success && surveysResult.data
    ? surveysResult.data.map(survey => ({
      _id: survey._id?.toString(),
      projectInfo: survey.projectInfo ? {
        projectName: survey.projectInfo.projectName,
        totalProjects: survey.projectInfo.totalProjects,
        projectDescription: survey.projectInfo.projectDescription,
        startDate: survey.projectInfo.startDate,
        endDate: survey.projectInfo.endDate,
        projectGoal: survey.projectInfo.projectGoal,
        regions: survey.projectInfo.regions,
        targetedNCDs: survey.projectInfo.targetedNCDs,
        fundingSource: survey.projectInfo.fundingSource
      } : null,
      organisationInfo: survey.organisationInfo ? {
        organisationName: survey.organisationInfo.organisationName,
        region: survey.organisationInfo.region,
        sector: survey.organisationInfo.sector,
        email: survey.organisationInfo.email,
        phone: survey.organisationInfo.hqPhoneNumber
      } : null,
      status: survey.status,
      submissionDate: survey.submissionDate?.toISOString?.() || survey.submissionDate || null,
      lastUpdated: survey.lastUpdated?.toISOString?.() || survey.lastUpdated || null,
      createdBy: survey.createdBy ? {
        userId: survey.createdBy.userId,
        userName: survey.createdBy.userName
      } : null
    }))
    : [];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <SubmittedSurveysTable surveys={userSurveys} />
    </div>
  );
}

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

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header - Loads immediately */}
      <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Analytics
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive survey insights and predictions</p>
        </div>
        <Link
          href="/dashboard/surveys/form"
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <RiSurveyLine size={20} />
          Start New Survey
        </Link>
      </div>

      {/* Enhanced Stats Cards - Stream in first (fastest) */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCardsSection userId={session.user.id} />
      </Suspense>

      {/* Survey Metrics Charts - Stream in second */}
      <Suspense fallback={<ChartSkeleton />}>
        <SurveyMetricsSection userId={session.user.id} />
      </Suspense>

      {/* Regional Insights - Stream in third */}
      <Suspense fallback={<RegionalInsightsSkeleton />}>
        <RegionalInsightsSection userId={session.user.id} />
      </Suspense>

      {/* Active Surveys Section - Stream in fourth */}
      <Suspense fallback={<ActiveSurveysSkeleton />}>
        <ActiveSurveysSection />
      </Suspense>

      {/* Submitted Surveys Table - Stream in last (potentially slowest) */}
      <Suspense fallback={<SubmittedSurveysTableSkeleton />}>
        <SubmittedSurveysSection userId={session.user.id} />
      </Suspense>
    </div>
  );
}
