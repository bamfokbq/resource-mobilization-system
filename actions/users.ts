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

    const userData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      telephone: formData.get('telephone') as string,
      role: role as "User" | "Admin",
      region: formData.get('region') as string | null,
      organisation: formData.get('organisation') as string | null,
      password: await hashPassword('ncd@2025'), // Using default password
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
      userId: result.insertedId,
      user: { ...userData, _id: result.insertedId }
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

