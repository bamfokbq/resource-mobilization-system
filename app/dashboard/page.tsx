import React from 'react';
import UserStatsCard from '@/components/dashboard/UserStatsCard';
import ActiveSurveyCard from '@/components/dashboard/ActiveSurveyCard';
import SubmittedSurveysTable from '@/components/tables/SubmittedSurveysTable';
import Link from 'next/link';
import { RiSurveyLine, RiCheckboxCircleLine, RiTimeLine } from 'react-icons/ri';

export default function UserDashboardPage() {
  // This would typically come from an API or database
  const mockActiveSurveys = [
    { id: '1', title: 'Community Health Assessment 2024', progress: 65, lastUpdated: '2024-01-15' },
    { id: '2', title: 'Healthcare Access Survey', progress: 30, lastUpdated: '2024-01-14' },
  ];

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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UserStatsCard
          title="Total Surveys"
          value={5}
          icon={<RiSurveyLine size={24} />}
        />
        <UserStatsCard
          title="Completed"
          value={3}
          icon={<RiCheckboxCircleLine size={24} />}
        />
        <UserStatsCard
          title="In Progress"
          value={2}
          icon={<RiTimeLine size={24} />}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Active Surveys</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockActiveSurveys.map((survey) => (
            <ActiveSurveyCard
              key={survey.id}
              id={survey.id}
              title={survey.title}
              progress={survey.progress}
              lastUpdated={survey.lastUpdated}
            />
          ))}
        </div>
      </div>

      <div>
        <SubmittedSurveysTable />
      </div>
    </div>
  );
}
