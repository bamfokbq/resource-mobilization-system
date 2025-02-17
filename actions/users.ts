"use server"

import { AdminProfile } from "@/types"
import client from "@/lib/db"
import { ObjectId } from "mongodb"

type UpdateProfileResponse = {
  success: boolean;
  data?: AdminProfile;
  error?: string;
}

export async function updateUserProfile(userId: string, formData: FormData) {
  console.log(formData);
  const profileData: AdminProfile = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    telephone: formData.get('telephone') as string,
    bio: formData.get('bio') as string,
  };

  try {
    const db = client.db()
    const result = await db.collection("user").updateOne(
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

