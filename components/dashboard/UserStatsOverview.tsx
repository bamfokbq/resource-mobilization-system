import { getUserStats } from '@/actions/users'
import { FaUsers, FaUserCheck, FaUserShield, FaUserPlus } from 'react-icons/fa'

interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  description: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

function StatsCard({ title, value, icon, description, trend }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className={`mr-1 ${trend.isPositive ? '↗' : '↘'}`}>
                {trend.isPositive ? '↗' : '↘'}
              </span>
              {trend.value}% from last month
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  )
}

export default async function UserStatsOverview() {
  const stats = await getUserStats()

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers className="h-8 w-8 text-blue-600" />,
      description: "All registered users",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: <FaUserCheck className="h-8 w-8 text-green-600" />,
      description: "Currently active users",
    },
    {
      title: "Administrators",
      value: stats.adminUsers,
      icon: <FaUserShield className="h-8 w-8 text-purple-600" />,
      description: "Admin privileges",
    },
    {
      title: "New This Month",
      value: stats.recentUsers,
      icon: <FaUserPlus className="h-8 w-8 text-orange-600" />,
      description: "Last 30 days",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <StatsCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            description={card.description}
          />
        ))}
      </div>
    </div>
  )
}
