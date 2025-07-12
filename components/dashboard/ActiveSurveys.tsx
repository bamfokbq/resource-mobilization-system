import ActiveSurveyCard from './ActiveSurveyCard';
import Link from 'next/link';
import { RiSurveyLine } from 'react-icons/ri';
import { ActiveSurvey } from '@/lib/dashboard/types';

interface ActiveSurveysProps {
  activeSurveys: ActiveSurvey[];
}

export default function ActiveSurveys({ activeSurveys }: ActiveSurveysProps) {
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
