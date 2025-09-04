import Link from 'next/link';
import React from 'react';
import { RiEdit2Line, RiEyeLine } from 'react-icons/ri';

interface ActiveSurveyCardProps {
  title: string;
  progress: number;
  lastUpdated: string;
  id: string;
}

export default function ActiveSurveyCard({ title, progress, lastUpdated, id }: ActiveSurveyCardProps) {
  // For drafts, link to the survey form, for completed surveys link to view page
  const href = id === 'draft' ? '/dashboard/surveys/form' : `/surveys/${id}`;
  const isDraft = id === 'draft';

  return (
    <Link href={href as any}>      
    <div
      className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group transform hover:scale-105 hover:-translate-y-1"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-gray-800 truncate flex-1">{title}</h3>
          <div className={`p-2 rounded-lg ${isDraft ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
            {isDraft ? <RiEdit2Line size={16} /> : <RiEyeLine size={16} />}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-semibold text-gray-800">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">              <div
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${progress >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
              progress >= 50 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                'bg-gradient-to-r from-orange-400 to-orange-600'
              }`}
            style={{ width: `${progress}%` }}
          />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Updated: {lastUpdated}
          </p>

          {isDraft && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
              Continue editing
            </span>
          )}
        </div>
      </div>
      </div>
    </Link>
  );
}
