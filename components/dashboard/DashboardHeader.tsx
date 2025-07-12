import Link from 'next/link';
import { RiSurveyLine } from 'react-icons/ri';

interface DashboardHeaderProps {
  userName?: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center bg-white rounded-xl p-6 shadow-lg">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard Analytics
        </h1>
        <p className="text-gray-600 mt-2">
          {userName ? `Welcome back, ${userName}! ` : ''}
          Comprehensive survey insights and predictions
        </p>
      </div>
      <Link
        href="/dashboard/surveys/form"
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
      >
        <RiSurveyLine size={20} />
        Start New Survey
      </Link>
    </div>
  );
}
