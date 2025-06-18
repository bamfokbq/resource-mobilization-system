import React from 'react';

interface UserStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export default function UserStatsCard({
  title,
  value,
  icon,
  trend,
  color = 'blue'
}: UserStatsCardProps) {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-50 to-blue-100',
      icon: 'text-blue-500',
      title: 'text-blue-600',
      value: 'text-blue-900',
      border: 'border-blue-200'
    },
    green: {
      gradient: 'from-green-50 to-green-100',
      icon: 'text-green-500',
      title: 'text-green-600',
      value: 'text-green-900',
      border: 'border-green-200'
    },
    purple: {
      gradient: 'from-purple-50 to-purple-100',
      icon: 'text-purple-500',
      title: 'text-purple-600',
      value: 'text-purple-900',
      border: 'border-purple-200'
    },
    orange: {
      gradient: 'from-orange-50 to-orange-100',
      icon: 'text-orange-500',
      title: 'text-orange-600',
      value: 'text-orange-900',
      border: 'border-orange-200'
    },
    red: {
      gradient: 'from-red-50 to-red-100',
      icon: 'text-red-500',
      title: 'text-red-600',
      value: 'text-red-900',
      border: 'border-red-200'
    }
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`bg-gradient-to-br ${colors.gradient} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border ${colors.border} relative overflow-hidden transform hover:scale-105`}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
        <div className={`${colors.icon} text-6xl`}>
          {icon}
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`${colors.icon} p-2 bg-white/50 rounded-lg`}>
              {icon}
            </div>
            <h3 className={`${colors.title} font-semibold text-sm`}>{title}</h3>
          </div>

          {trend && (
            <div className={`text-xs px-2 py-1 rounded-full ${trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>

        <p className={`text-4xl font-bold ${colors.value} mb-2`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>

        {trend && (
          <p className="text-xs text-gray-600">
            {trend.isPositive ? 'Increase' : 'Decrease'} from last period
          </p>
        )}
      </div>
    </div>
  );
}
