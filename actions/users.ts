'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'

const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional()
})

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  region: z.string().min(1, { message: "Region is required" }),
  organisation: z.string().min(1, { message: "Organisation is required" })
})

export async function loginAction(prevState: any, formData: FormData) {
  // Simulate a delay to mimic real-world authentication
  await new Promise(resolve => setTimeout(resolve, 1000))

  const rawFormData = {
    email: formData.get('email'),
    password: formData.get('password'),
    rememberMe: formData.get('rememberMe') === 'on'
  }

  // Validate the form data
  const validationResult = LoginSchema.safeParse(rawFormData)

  // Handle validation errors
  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Invalid form submission'
    }
  }

  try {
    // Simulate a successful login
    return {
      success: true,
      message: 'Login successful!',
      email: rawFormData.email
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      success: false,
      message: 'An unexpected error occurred',
      errors: {}
    };
  } finally {
    redirect('/dashboard');
  }
}

export async function registerUserAction(prevState: any, formData: FormData) {
  // Simulate a delay to mimic real-world registration
  await new Promise(resolve => setTimeout(resolve, 1000))

  const rawFormData = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
    region: formData.get('region'),
    organisation: formData.get('organisation')
  }

  // Validate the form data
  const validationResult = formSchema.safeParse(rawFormData)

  // Handle validation errors
  if (!validationResult.success) {
    return {
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
      message: 'Invalid form submission'
    }
  }

  try {
    // Simulate a successful registration
    return {
      success: true,
      message: 'Registration successful!',
      email: rawFormData.email
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      success: false,
      message: 'An unexpected error occurred',
      errors: {}
    };
  } finally {
    redirect('/dashboard');
  }
}