import Link from 'next/link';
import React from 'react';

interface ActiveSurveyCardProps {
  title: string;
  progress: number;
  lastUpdated: string;
  id: string;
}

export default function ActiveSurveyCard({ title, progress, lastUpdated, id }: ActiveSurveyCardProps) {
  // For drafts, link to the survey form, for completed surveys link to view page
  const href = id === 'draft' ? '/dashboard/surveys/form' : `/surveys/${id}`;

  return (
    <Link href={href}>
      <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <h3 className="font-medium mb-2">{title}</h3>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-navy-blue h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        {id === 'draft' && (
          <p className="text-xs text-blue-600 mt-2">Click to continue editing</p>
        )}
      </div>
    </Link>
  );
}
