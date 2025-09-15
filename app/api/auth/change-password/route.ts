import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getDb } from '@/lib/db'
import { comparePassword, hashPassword } from '@/lib/password'
import { validatePasswordStrength } from '@/lib/passwordGenerator'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    // Validate new password strength
    const strength = validatePasswordStrength(newPassword)
    if (!strength.isValid) {
      return NextResponse.json(
        { error: `Password does not meet requirements: ${strength.errors.join(', ')}` },
        { status: 400 }
      )
    }

    const db = await getDb()
    const user = await db.collection('users').findOne({
      _id: new ObjectId(session.user.id)
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword)

    // Update user password and set firstLogin to false
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          password: hashedNewPassword,
          firstLogin: false,
          passwordChangedAt: new Date(),
          // Remove temporary password if it exists
          $unset: { temporaryPassword: 1 }
        }
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
