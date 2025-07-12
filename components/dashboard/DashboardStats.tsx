import UserStatsCard from './UserStatsCard';
import { RiBarChartLine, RiCheckboxCircleLine, RiSurveyLine, RiTimeLine } from 'react-icons/ri';
import { DashboardMetrics } from '@/lib/dashboard/types';

interface DashboardStatsProps {
  metrics: DashboardMetrics;
}

export default function DashboardStats({ metrics }: DashboardStatsProps) {
  const {
    totalSurveys,
    completedSurveys,
    inProgressSurveys,
    avgCompletion
  } = metrics;

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
