"use server"

import { getDb } from "@/lib/db"
import { ObjectId } from "mongodb"
import { comparePassword, hashPassword } from "@/lib/password"

export async function updateUserProfile(userId: string, formData: FormData) {
  console.log(formData);
  const profileData: any = {};

  // Only include fields that are provided
  const telephone = formData.get('telephone') as string;
  const bio = formData.get('bio') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;

  if (telephone !== null) profileData.telephone = telephone;
  if (bio !== null) profileData.bio = bio;
  if (firstName) profileData.firstName = firstName;
  if (lastName) profileData.lastName = lastName;
  if (email) profileData.email = email;

  try {
    const db = await getDb()
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: profileData }
    )

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" }
    }

    return { success: true, data: profileData }
  } catch (error) {
    console.error("Failed to update user profile:", error)
    return { success: false, error: "Failed to update user profile" }
  }
}

export async function createNewUser(formData: FormData) {
  try {
    const role = formData.get('role') as string;
    if (role !== 'User' && role !== 'Admin') {
      return { success: false, error: "Invalid role" };
    }

    // Use default password
    const defaultPassword = 'rms@2025';
    const hashedPassword = await hashPassword(defaultPassword);

    const userData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      telephone: formData.get('telephone') as string,
      role: role as "User" | "Admin",
      region: formData.get('region') as string | null,
      organisation: formData.get('organisation') as string | null,
      password: hashedPassword,
      createdAt: new Date(),
      isActive: true,
      bio: '',
    };

    // Remove optional fields if role is Admin
    // if (userData.role === 'Admin') {
    //   delete userData.region;
    //   delete userData.organisation;
    // }

    const db = await getDb();

    // Check if email already exists
    const existingUser = await db.collection("users").findOne({ email: userData.email });
    if (existingUser) {
      return { success: false, error: "Email already exists" };
    }

    // Create new user
    const result = await db.collection("users").insertOne(userData);
    if (!result.insertedId) {
      return { success: false, error: "Failed to create user" };
    } 
    
    return {
      success: true,
      message: "User created successfully"
    };

  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function getUserbyEmailAndHashPassword(email: string, password: string) {
  const db = await getDb();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return null;
  }

  const isValid = await comparePassword(password, user.password);

  if (!isValid) {
    return null;
  }
  return user;
}

export async function updateUserEditableProfile(userId: string, telephone: string, bio: string) {
  try {
    const db = await getDb()
    const updateData: any = {};

    // Only update non-empty values
    if (telephone !== undefined && telephone !== null) {
      updateData.telephone = telephone;
    }
    if (bio !== undefined && bio !== null) {
      updateData.bio = bio;
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" }
    }

    return { success: true, data: updateData }
  } catch (error) {
    console.error("Failed to update user profile:", error)
    return { success: false, error: "Failed to update user profile" }
  }
}

export async function getAllUsers() {
  try {
    const db = await getDb()
    const users = await db.collection("users").find({
      email: { $ne: "systemowner@gmail.com" }
    }, {
      projection: {
        password: 0,
      }
    }).toArray();
    return users.map(user => ({
      id: user._id.toString(),
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      region: user.region || '',
      telephone: user.telephone || '',
      organisation: user.organisation || '',
      role: user.role || 'User',
      isActive: user.isActive ?? true,
      createdAt: user.createdAt,
      bio: user.bio || '',
      passwordResetAt: user.passwordResetAt,
      statusUpdatedAt: user.statusUpdatedAt
    }))
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return []
  }
}

export async function getUserStats() {
  try {
    const db = await getDb()

    const totalUsers = await db.collection("users").countDocuments()
    const activeUsers = await db.collection("users").countDocuments({ isActive: true })
    const adminUsers = await db.collection("users").countDocuments({ role: "Admin" })
    const regularUsers = await db.collection("users").countDocuments({ role: "User" })

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentUsers = await db.collection("users").countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    })

    // Get users by region
    const usersByRegion = await db.collection("users").aggregate([
      { $group: { _id: "$region", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray()

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      regularUsers,
      recentUsers,
      usersByRegion: usersByRegion.map(item => ({
        region: item._id || 'Unknown',
        count: item.count
      }))
    }
  } catch (error) {
    console.error("Failed to fetch user stats:", error)
    return {
      totalUsers: 0,
      activeUsers: 0,
      adminUsers: 0,
      regularUsers: 0,
      recentUsers: 0,
      usersByRegion: []
    }
  }
}

export async function resetUserPassword(userId: string, newPassword?: string) {
  try {
    const db = await getDb()

    // Use provided password or default to 'rms@2025'
    const passwordToHash = newPassword || 'rms@2025'
    const hashedPassword = await hashPassword(passwordToHash)

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          password: hashedPassword,
          passwordResetAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" }
    }

    return { success: true, message: "Password reset successfully" }
  } catch (error) {
    console.error("Failed to reset user password:", error)
    return { success: false, error: "Failed to reset password" }
  }
}

export async function toggleUserStatus(userId: string) {
  try {
    const db = await getDb()

    // First get the current status
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    if (!user) {
      return { success: false, error: "User not found" }
    }

    const newStatus = !user.isActive

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          isActive: newStatus,
          statusUpdatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" }
    }

    return {
      success: true,
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
      newStatus
    }
  } catch (error) {
    console.error("Failed to toggle user status:", error)
    return { success: false, error: "Failed to update user status" }
  }
}

export async function getUserProfile(userId: string) {
  try {
    const db = await getDb()
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          password: 0, // Exclude password for security
        }
      }
    )

    if (!user) {
      return { success: false, error: "User not found" }
    }

    return {
      success: true,
      data: {
        id: user._id.toString(),
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        telephone: user.telephone || '',
        bio: user.bio || '',
        role: user.role || 'User',
        region: user.region || '',
        organisation: user.organisation || '',
        isActive: user.isActive ?? true,
        createdAt: user.createdAt,
        passwordResetAt: user.passwordResetAt,
        statusUpdatedAt: user.statusUpdatedAt
      }
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    return { success: false, error: "Failed to fetch user profile" }
  }
}

