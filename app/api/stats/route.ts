import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const db = await getDb()
    
    const [totalSurveys, totalDrafts, totalUsers] = await Promise.all([
      db.collection('surveys').countDocuments({ status: 'submitted' }),
      db.collection('survey_drafts').countDocuments(),
      db.collection('users').countDocuments()
    ])

    // Get recent activity count (last 24 hours)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const recentActivity = await db.collection('surveys').countDocuments({
      submissionDate: { $gte: yesterday },
      status: 'submitted'
    })

    return NextResponse.json({
      totalSurveys,
      totalDrafts,
      totalUsers,
      recentActivity,
      completionRate: totalSurveys + totalDrafts > 0 ? Math.round((totalSurveys / (totalSurveys + totalDrafts)) * 100) : 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Stats API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
