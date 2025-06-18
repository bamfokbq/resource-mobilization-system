import React from 'react';
import UserStatsCard from '@/components/dashboard/UserStatsCard';
import ActiveSurveyCard from '@/components/dashboard/ActiveSurveyCard';
import SubmittedSurveysTable from '@/components/tables/SubmittedSurveysTable';
import SurveyMetricsChart from '@/components/dashboard/SurveyMetricsChart';
import SurveyProgressAnalytics from '@/components/dashboard/SurveyProgressAnalytics';
import RegionalInsights from '@/components/dashboard/RegionalInsights';
import SurveyPredictiveAnalytics from '@/components/dashboard/SurveyPredictiveAnalytics';
import Link from 'next/link';
import { RiSurveyLine, RiCheckboxCircleLine, RiTimeLine, RiBarChartLine } from 'react-icons/ri';
import { getAllSurveys, getUserDraft } from '@/actions/surveyActions';
import { auth } from '@/auth';

// Mock data generators for the enhanced dashboard
const generateMockSurveyMetrics = (totalSurveys: number, completedSurveys: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, index) => ({
    month,
    submitted: Math.floor(completedSurveys * (index + 1) / 6),
    draft: Math.floor((totalSurveys - completedSurveys) * Math.random()),
    total: Math.floor(totalSurveys * (index + 1) / 6)
  }));
};

const generateMockStatusData = (completedSurveys: number, inProgressSurveys: number) => [
  { name: 'Completed', value: completedSurveys, color: '#10B981' },
  { name: 'In Progress', value: inProgressSurveys, color: '#F59E0B' },
  { name: 'Draft', value: Math.max(1, inProgressSurveys), color: '#6B7280' }
];

const generateMockProgressData = () => [
  { step: 'Organization Info', completion: 95, users: 18 },
  { step: 'Project Info', completion: 87, users: 15 },
  { step: 'Activities', completion: 73, users: 12 },
  { step: 'Background', completion: 68, users: 10 },
  { step: 'Review', completion: 45, users: 8 }
];

const generateMockTimelineData = () => {
  const dates = [];
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push({
      date: date.toISOString().split('T')[0],
      progress: Math.min(100, 20 + i * 2.5 + Math.random() * 10),
      target: 20 + i * 2.8
    });
  }
  return dates;
};

const generateMockRegionalData = () => [
  { region: 'Greater Accra', surveys: 45, completion: 85, engagement: 92, satisfaction: 88, efficiency: 90, impact: 87 },
  { region: 'Ashanti', surveys: 38, completion: 78, engagement: 85, satisfaction: 82, efficiency: 83, impact: 80 },
  { region: 'Northern', surveys: 25, completion: 72, engagement: 78, satisfaction: 75, efficiency: 77, impact: 74 },
  { region: 'Western', surveys: 32, completion: 80, engagement: 83, satisfaction: 79, efficiency: 85, impact: 82 },
  { region: 'Eastern', surveys: 28, completion: 75, engagement: 80, satisfaction: 77, efficiency: 79, impact: 76 }
];

const generateMockEffortData = () => [
  { complexity: 3.2, completion: 85, region: 'Greater Accra', surveys: 45 },
  { complexity: 2.8, completion: 78, region: 'Ashanti', surveys: 38 },
  { complexity: 4.1, completion: 72, region: 'Northern', surveys: 25 },
  { complexity: 3.5, completion: 80, region: 'Western', surveys: 32 },
  { complexity: 3.8, completion: 75, region: 'Eastern', surveys: 28 }
];

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
  // Filter surveys for the current user and serialize for client components
  const userSurveys = surveysResult.success && surveysResult.data
    ? surveysResult.data
      .filter(survey => survey.createdBy?.userId === session?.user?.id)
      .map(survey => ({
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
  // Calculate statistics
  const totalSurveys = userSurveys.length;
  const completedSurveys = userSurveys.filter(survey => survey.status === 'submitted').length;
  const inProgressSurveys = draftResult.success ? 1 : 0; // User can only have one draft at a time

  // Generate enhanced analytics data
  const surveyMetricsData = generateMockSurveyMetrics(totalSurveys, completedSurveys);
  const statusData = generateMockStatusData(completedSurveys, inProgressSurveys);
  const progressData = generateMockProgressData();
  const timelineData = generateMockTimelineData();
  const regionalData = generateMockRegionalData();
  const effortData = generateMockEffortData();
  const predictionData = generateMockPredictionData();
  const milestones = generateMockMilestones();

  // Enhanced statistics
  const avgCompletion = Math.floor(75 + Math.random() * 20); // Mock data
  const totalUsers = Math.max(1, Math.floor(totalSurveys * 1.3));
  const completionRate = totalSurveys > 0 ? Math.floor((completedSurveys / totalSurveys) * 100) : 0;
  // Prepare active surveys (drafts)
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
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
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

      {/* Enhanced Stats Cards */}
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

      {/* Survey Metrics Charts */}
      <SurveyMetricsChart
        data={surveyMetricsData}
        statusData={statusData}
      />

      {/* Progress Analytics */}
      <SurveyProgressAnalytics
        progressData={progressData}
        timelineData={timelineData}
        totalUsers={totalUsers}
        avgCompletion={avgCompletion}
        completionRate={completionRate}
      />

      {/* Regional Insights */}
      <RegionalInsights
        regionMetrics={regionalData}
        effortData={effortData}
      />

      {/* Predictive Analytics */}
      <SurveyPredictiveAnalytics
        predictionData={predictionData}
        milestones={milestones}
        projectedCompletion={95}
        timeToTarget={23}
        confidenceLevel={87}
      />

      {/* Active Surveys Section */}
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

      {/* Submitted Surveys Table */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <SubmittedSurveysTable surveys={userSurveys} />
      </div>
    </div>
  );
}
