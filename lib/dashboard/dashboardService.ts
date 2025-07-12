import { 
  getUserSurveys, 
  getPredictiveAnalytics, 
  getSurveyAnalytics, 
  getUserDraft, 
  getUserSurveyStatistics 
} from '@/actions/surveyActions';
import { 
  DashboardData, 
  Survey, 
  ActiveSurvey, 
  DashboardMetrics,
  ApiResult,
  DraftResult,
  PredictionData,
  Milestone
} from './types';

/**
 * Main service function to fetch all dashboard data
 */
export async function fetchDashboardData(userId: string): Promise<DashboardData> {
  try {
    // Parallel data fetching for better performance
    const [surveysResult, draftResult, analyticsResult, userStatsResult, predictiveResult] = await Promise.all([
      getUserSurveys(userId),
      getUserDraft(),
      getSurveyAnalytics(userId),
      getUserSurveyStatistics(userId),
      getPredictiveAnalytics(userId)
    ]);

    // Process and transform data
    const userSurveys = processSurveyData(surveysResult);
    const activeSurveys = processActiveSurveys(draftResult);
    const metrics = calculateMetrics(userSurveys, draftResult);
    
    // Extract analytics data
    const analyticsData = analyticsResult.success ? analyticsResult.data : null;
    const userStats = userStatsResult.success ? userStatsResult.data : null;
    const predictiveData = predictiveResult.success ? predictiveResult.data : null;

    // Process chart and analytics data
    const dashboardData = processDashboardAnalytics({
      userSurveys,
      metrics,
      analyticsData,
      userStats,
      predictiveData,
      activeSurveys
    });

    return dashboardData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw new Error('Failed to fetch dashboard data');
  }
}

/**
 * Process raw survey data from API response
 */
function processSurveyData(surveysResult: ApiResult<any[]>): Survey[] {
  if (!surveysResult.success || !surveysResult.data) {
    return [];
  }

  return surveysResult.data.map(survey => ({
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
  }));
}

/**
 * Process active surveys (drafts) data
 */
function processActiveSurveys(draftResult: DraftResult): ActiveSurvey[] {
  const activeSurveys: ActiveSurvey[] = [];
  
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

  return activeSurveys;
}

/**
 * Calculate basic dashboard metrics
 */
function calculateMetrics(userSurveys: Survey[], draftResult: DraftResult): DashboardMetrics {
  const totalSurveys = userSurveys.length;
  const completedSurveys = userSurveys.filter(survey => survey.status === 'submitted').length;
  const inProgressSurveys = draftResult.success ? 1 : 0;
  const avgCompletion = completedSurveys > 0 ? 100 : 0;
  const completionRate = totalSurveys > 0 ? Math.floor((completedSurveys / totalSurveys) * 100) : 0;

  return {
    totalSurveys,
    completedSurveys,
    inProgressSurveys,
    avgCompletion,
    completionRate,
    totalUsers: 1
  };
}

/**
 * Process all dashboard analytics data
 */
function processDashboardAnalytics({
  userSurveys,
  metrics,
  analyticsData,
  userStats,
  predictiveData,
  activeSurveys
}: {
  userSurveys: Survey[];
  metrics: DashboardMetrics;
  analyticsData: any;
  userStats: any;
  predictiveData: any;
  activeSurveys: ActiveSurvey[];
}): DashboardData {
  
  // Survey metrics and status data
  const surveyMetricsData = analyticsData?.surveyMetrics || [
    { month: 'Current', submitted: metrics.completedSurveys, draft: metrics.inProgressSurveys, total: metrics.totalSurveys }
  ];
  
  const statusData = analyticsData?.statusData || [
    { name: 'Completed', value: metrics.completedSurveys, color: '#10B981' },
    { name: 'In Progress', value: metrics.inProgressSurveys, color: '#F59E0B' },
    { name: 'Draft', value: metrics.inProgressSurveys, color: '#6B7280' }
  ];

  // Progress and timeline data
  const progressData = analyticsData?.progressData || [
    { step: 'Organization Info', completion: metrics.totalSurveys > 0 ? 100 : 0, users: metrics.totalSurveys },
    { step: 'Project Info', completion: metrics.totalSurveys > 0 ? 100 : 0, users: metrics.totalSurveys },
    { step: 'Activities', completion: metrics.completedSurveys > 0 ? 100 : 0, users: metrics.completedSurveys },
    { step: 'Background', completion: metrics.completedSurveys > 0 ? 100 : 0, users: metrics.completedSurveys },
    { step: 'Review', completion: metrics.completedSurveys > 0 ? 100 : 0, users: metrics.completedSurveys }
  ];
  
  const timelineData = analyticsData?.timelineData || [
    { date: new Date().toISOString().split('T')[0], progress: userStats?.completionRate || 0, target: 100 }
  ];

  // Regional insights
  const regionalData = analyticsData?.regionalData || [];
  const effortData = analyticsData?.effortData || [];

  // Predictive data (using real analysis when available)
  const predictionData = predictiveData?.predictionData || generateMockPredictionData();
  const milestones = predictiveData?.milestones || generateMockMilestones();
  const projectedCompletion = predictiveData?.projectedCompletion || 85;
  const timeToTarget = predictiveData?.timeToTarget || 15;
  const confidenceLevel = predictiveData?.confidenceLevel || 75;

  // Enhanced statistics from real data
  const enhancedMetrics: DashboardMetrics = {
    ...metrics,
    avgCompletion: userStats?.averageCompletion || metrics.avgCompletion,
    totalUsers: userStats?.totalUsers || 1,
    completionRate: userStats?.completionRate || metrics.completionRate
  };

  return {
    userSurveys,
    metrics: enhancedMetrics,
    surveyMetricsData,
    statusData,
    progressData,
    timelineData,
    regionalData,
    effortData,
    predictionData,
    milestones,
    projectedCompletion,
    timeToTarget,
    confidenceLevel,
    activeSurveys,
    analyticsData,
    userStats,
    predictiveData
  };
}

/**
 * Generate mock prediction data for development/fallback
 */
function generateMockPredictionData(): PredictionData[] {
  const data: PredictionData[] = [];
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
}

/**
 * Generate mock milestones for development/fallback
 */
function generateMockMilestones(): Milestone[] {
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
}
