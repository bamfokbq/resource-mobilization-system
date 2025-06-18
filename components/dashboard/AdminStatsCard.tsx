import React from 'react';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export default function AdminStatsCard({
  title,
  value,
  icon,
  trend,
  color = 'blue'
}: AdminStatsCardProps) {
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

  const currentColor = colorClasses[color];

  return (
    <div className={`
      bg-gradient-to-br ${currentColor.gradient} 
      border ${currentColor.border}
      rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 
      transform hover:scale-105 group
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className={`
          p-3 rounded-lg bg-white/70 ${currentColor.icon} 
          group-hover:scale-110 transition-transform duration-300
        `}>
          {icon}
        </div>
        
        {trend && (
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
            ${trend.isPositive 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
            }
          `}>
            <span className={trend.isPositive ? '↗' : '↘'}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className={`text-sm font-medium ${currentColor.title}`}>
          {title}
        </p>
        <p className={`text-3xl font-bold ${currentColor.value}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
}
