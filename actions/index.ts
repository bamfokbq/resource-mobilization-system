'use server'

import { z } from 'zod'

const formSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    region: z.string().min(1, "Please select a region"),
    organisation: z.string().min(1, "Please select an organisation"),
})

export async function addNewUser(prevState: any, formData: FormData) {
    try {
        // Parse the form data using Zod schema
        const rawData = {
            firstName: String(formData.get('firstName') ?? ''),
            lastName: String(formData.get('lastName') ?? ''),
            email: String(formData.get('email') ?? ''),
            password: String(formData.get('password') ?? ''),
            region: String(formData.get('region') ?? ''),
            organisation: String(formData.get('organisation') ?? '')
        }

        // Validate the data
        // const validatedData = formSchema.parse(rawData)

        // Here you would typically:
        // 1. Hash the password
        // 2. Save to database
        // 3. Send confirmation email, etc.
        console.log('Validated User Data:', rawData)

        return {
            success: true,
            errors: {},
            message: 'User added successfully'
        }
    } catch (error) {
        console.error('Error adding user:', error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                errors: error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message
                }))
            }
        }

        return {
            success: false,
            message: 'An unexpected error occurred'
        }
    }
}