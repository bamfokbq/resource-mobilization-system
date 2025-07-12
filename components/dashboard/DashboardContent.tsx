import SurveyMetricsChart from './SurveyMetricsChart';
import RegionalInsights from './RegionalInsights';
import ActiveSurveys from './ActiveSurveys';
import SubmittedSurveysTable from '@/components/tables/SubmittedSurveysTable';
import { DashboardData } from '@/lib/dashboard/types';

interface DashboardContentProps {
  data: DashboardData;
}

export default function DashboardContent({ data }: DashboardContentProps) {
  const {
    userSurveys,
    surveyMetricsData,
    statusData,
    regionalData,
    effortData,
    activeSurveys
  } = data;

  return (
    <>
      {/* Survey Metrics Charts */}
      <SurveyMetricsChart
        data={surveyMetricsData}
        statusData={statusData}
      />

      {/* Progress Analytics - Contains Survey Step Completion and Progress Over Time */}
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
      />

      {/* Predictive Analytics - Contains Survey Completion Forecast and Upcoming Milestones */}
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
      <ActiveSurveys activeSurveys={activeSurveys} />

      {/* Submitted Surveys Table */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <SubmittedSurveysTable surveys={userSurveys} />
      </div>
    </>
  );
}
