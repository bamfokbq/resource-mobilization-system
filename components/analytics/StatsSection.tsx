import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion/react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useAdminStats } from '@/hooks/useAdminStats'
import { MdOutlinePoll } from "react-icons/md"
import { FiUsers } from "react-icons/fi"
import { BsCalendar3 } from "react-icons/bs"
import { AiOutlineProject } from "react-icons/ai"

// Icon mapping for each stat type
const getIconForStat = (id: number) => {
  switch (id) {
    case 1: return MdOutlinePoll
    case 2: return FiUsers
    case 3: return BsCalendar3
    case 4: return AiOutlineProject
    default: return MdOutlinePoll
  }
}

export default function StatsSection() {
  const { stats, isLoading, lastUpdated } = useAdminStats()

  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="w-full h-1 bg-gray-200 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradientColors(index)} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getGradientColors(index)} shadow-lg`}>
                  {(() => {
                    const IconComponent = getIconForStat(stat.id)
                    return <IconComponent className="w-6 h-6 text-white" />
                  })()}
                </div>
                <Badge 
                  variant="secondary" 
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {stat.name}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {stat.amount}
                  </h3>
                  <span className="text-sm text-gray-500">total</span>
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>This month</span>
                  <span>{getProgressPercentage(stat.id)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div 
                    className={`h-1.5 rounded-full bg-gradient-to-r ${getGradientColors(index)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage(stat.id)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {/* Last updated indicator */}
      {lastUpdated && (
        <div className="col-span-full text-center">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}

// Helper function to get gradient colors for variety
function getGradientColors(index: number) {
  const gradients = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600', 
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-red-500 to-red-600',
    'from-indigo-500 to-indigo-600',
    'from-pink-500 to-pink-600',
    'from-teal-500 to-teal-600'
  ]
  return gradients[index % gradients.length]
}

// Helper function to get deterministic progress percentage based on stat ID
function getProgressPercentage(statId: number) {
  // Use stat ID to generate consistent percentage values between 60-95%
  const percentages = [75, 82, 68, 91, 77, 85, 73, 89]
  return percentages[(statId - 1) % percentages.length]
}
