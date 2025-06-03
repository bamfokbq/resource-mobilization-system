'use server'

import { z } from 'zod'

const formSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters").nonempty("First name is required"),
    lastName: z.string().min(2, "Last name must be at least 2 characters").nonempty("Last name is required"),
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    region: z.string().nonempty("Region is required"),
    organisation: z.string().nonempty("Organisation is required"),
    role: z.enum(["User", "Admin"], {
        required_error: "Role is required",
        invalid_type_error: "Role must be either User or Admin"
    }).default("User"),
    password: z.string().default(process.env.DEFAULT_PASSWORD || 'ncd@2025')
})

// Re-export survey actions for convenience
export { 
    submitSurveyData, 
    saveSurveyDraft, 
    getSurveyById, 
    getAllSurveys, 
    updateSurveyData, 
    deleteSurvey 
} from './surveyActions'

export async function addNewUser(prevState: any, formData: FormData) {
    try {
        const rawData = {
            firstName: String(formData.get('firstName') ?? ''),
            lastName: String(formData.get('lastName') ?? ''),
            email: String(formData.get('email') ?? ''),
            password: 'ncd@2025', // Using default password
            region: String(formData.get('region') ?? ''),
            organisation: String(formData.get('organisation') ?? ''),
            role: String(formData.get('role') ?? 'User')
        }

        const validatedData = formSchema.parse(rawData)

        console.log('Validated User Data:', validatedData)

        return {
            success: true,
            errors: null,
            message: 'User added successfully'
        }
    } catch (error) {
        console.error('Error adding user:', error)

        if (error instanceof z.ZodError) {
            const fieldErrors: Record<string, string> = {};
            error.errors.forEach((err) => {
                const fieldName = err.path[0] as string;
                fieldErrors[fieldName] = err.message;
            });

            return {
                success: false,
                errors: fieldErrors,
                message: 'Please check the form for errors'
            }
        }

        return {
            success: false,
            errors: null,
            message: 'An unexpected error occurred'
        }
    }
}