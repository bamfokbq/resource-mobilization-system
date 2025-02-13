import React from 'react';

interface UserStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export default function UserStatsCard({ title, value, icon }: UserStatsCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-navy-blue">{icon}</span>
        <h3 className="text-gray-600 font-medium">{title}</h3>
      </div>
      <p className="text-3xl font-semibold text-navy-blue">{value}</p>
    </div>
  );
}
