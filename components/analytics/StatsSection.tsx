import { ADMIN_STATS } from '@/constant'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'motion/react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsSection() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {ADMIN_STATS.map((stat, index) => (
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
                  <stat.icon className="w-6 h-6 text-white" />
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
                  <span>{Math.floor(Math.random() * 40 + 60)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div 
                    className={`h-1.5 rounded-full bg-gradient-to-r ${getGradientColors(index)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
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
