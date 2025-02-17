"use server"

import { AdminProfile } from "@/types"
import client from "@/lib/db"
import { ObjectId } from "mongodb"

export async function updateUserProfile(userId: string, profileData: AdminProfile) {
  try {
    const db = client.db()
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: profileData }
    )

    if (result.matchedCount === 0) {
      throw new Error("User not found")
    }

    return { success: true, data: profileData }
  } catch (error) {
    console.error("Failed to update user profile:", error)
    return { success: false, error: "Failed to update user profile" }
    }
}

