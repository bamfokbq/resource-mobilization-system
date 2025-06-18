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
import { getAllSurveys, getUserDraft, getSurveyAnalytics, getUserSurveyStatistics, getPredictiveAnalytics } from '@/actions/surveyActions';
import { auth } from '@/auth';

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
  const inProgressSurveys = draftResult.success ? 1 : 0; // User can only have one draft at a time  // Fetch analytics data from database
  const [analyticsResult, userStatsResult, predictiveResult] = await Promise.all([
    getSurveyAnalytics(),
    getUserSurveyStatistics(session.user.id),
    getPredictiveAnalytics()
  ]);

  // Use real data if available, fallback to basic calculations
  const analyticsData = analyticsResult.success ? analyticsResult.data : null;
  const userStats = userStatsResult.success ? userStatsResult.data : null;
  const predictiveData = predictiveResult.success ? predictiveResult.data : null;

  // Survey metrics and status data
  const surveyMetricsData = analyticsData?.surveyMetrics || [
    { month: 'Current', submitted: completedSurveys, draft: inProgressSurveys, total: totalSurveys }
  ];
  const statusData = analyticsData?.statusData || [
    { name: 'Completed', value: completedSurveys, color: '#10B981' },
    { name: 'In Progress', value: inProgressSurveys, color: '#F59E0B' },
    { name: 'Draft', value: inProgressSurveys, color: '#6B7280' }
  ];

  // Progress and timeline data
  const progressData = analyticsData?.progressData || [
    { step: 'Organization Info', completion: totalSurveys > 0 ? 100 : 0, users: totalSurveys },
    { step: 'Project Info', completion: totalSurveys > 0 ? 100 : 0, users: totalSurveys },
    { step: 'Activities', completion: completedSurveys > 0 ? 100 : 0, users: completedSurveys },
    { step: 'Background', completion: completedSurveys > 0 ? 100 : 0, users: completedSurveys },
    { step: 'Review', completion: completedSurveys > 0 ? 100 : 0, users: completedSurveys }
  ];
  const timelineData = analyticsData?.timelineData || [
    { date: new Date().toISOString().split('T')[0], progress: userStats?.completionRate || 0, target: 100 }
  ];

  // Regional insights
  const regionalData = analyticsData?.regionalData || [];
  const effortData = analyticsData?.effortData || [];
  // Predictive data (now using real analysis when available)
  const predictionData = predictiveData?.predictionData || generateMockPredictionData();
  const milestones = predictiveData?.milestones || generateMockMilestones();
  const projectedCompletion = predictiveData?.projectedCompletion || 85;
  const timeToTarget = predictiveData?.timeToTarget || 15;
  const confidenceLevel = predictiveData?.confidenceLevel || 75;

  // Enhanced statistics from real data
  const avgCompletion = userStats?.averageCompletion || (completedSurveys > 0 ? 100 : 0);
  const totalUsers = userStats?.totalUsers || 1;
  const completionRate = userStats?.completionRate || (totalSurveys > 0 ? Math.floor((completedSurveys / totalSurveys) * 100) : 0);
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
      />      {/* Progress Analytics - Contains Survey Step Completion and Progress Over Time */}
      {/*
      <SurveyProgressAnalytics
        progressData={progressData}
        timelineData={timelineData}
        totalUsers={totalUsers}
        avgCompletion={avgCompletion}
        completionRate={completionRate}
      />
      */}

      {/* Regional Insights */}
      <RegionalInsights
        regionMetrics={regionalData}
        effortData={effortData}
      />      {/* Predictive Analytics - Contains Survey Completion Forecast and Upcoming Milestones */}
      {/*
      <SurveyPredictiveAnalytics
        predictionData={predictionData}
        milestones={milestones}
        projectedCompletion={projectedCompletion}
        timeToTarget={timeToTarget}
        confidenceLevel={confidenceLevel}
      />
      */}

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
