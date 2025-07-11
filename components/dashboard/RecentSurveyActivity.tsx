"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaUser } from 'react-icons/fa'

interface RecentActivityProps {
  activities: Array<{
    _id: string;
    organisationName: string;
    projectName: string;
    region: string;
    submissionDate: string;
    status: string;
    createdBy: string;
  }>
}

const RecentSurveyActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'submitted': 'bg-green-100 text-green-800',
      'draft': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-blue-100 text-blue-800',
      'inactive': 'bg-gray-100 text-gray-800'
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg text-center">
        <FaCalendarAlt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
        <p className="text-gray-600">Recent survey activity will appear here.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-blue-500 text-xl" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <p className="text-gray-600">Latest survey submissions</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Last {activities.length} activities
        </Badge>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity._id} 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FaBuilding className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-gray-900">{activity.organisationName}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{activity.projectName}</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="h-3 w-3" />
                  <span>{activity.region}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaUser className="h-3 w-3" />
                  <span>{activity.createdBy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaCalendarAlt className="h-3 w-3" />
                  <span>{formatDate(activity.submissionDate)}</span>
                </div>
              </div>
            </div>
            
            <div className="ml-4">
              <Badge className={`${getStatusBadge(activity.status)} font-medium`}>
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentSurveyActivity
