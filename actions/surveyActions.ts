'use server'

import { z } from 'zod'
import client from '@/lib/db'
import { FormData } from '@/types/forms'
import { ObjectId } from 'mongodb'
import { auth } from '@/auth'

// Comprehensive validation schema for the complete survey data
const surveyDataSchema = z.object({
  organisationInfo: z.object({
    organisationName: z.string().min(1, "Organisation name is required"),
    region: z.string().min(1, "Region is required"),
    hasRegionalOffice: z.boolean(),
    regionalOfficeLocation: z.string().optional(),
    gpsCoordinates: z.object({
      latitude: z.string(),
      longitude: z.string(),
    }),
    ghanaPostGPS: z.string(),
    sector: z.string().min(1, "Sector is required"),
    hqPhoneNumber: z.string().min(1, "Headquarters phone number is required"),
    regionalPhoneNumber: z.string().optional(),
    email: z.string().email("Valid email is required"),
    website: z.string().optional(),
    registrationNumber: z.string().optional(),
    address: z.string().optional(),
    contactPerson: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  
  projectInfo: z.object({
    totalProjects: z.number().min(1, "Total projects must be at least 1"),
    projectName: z.string().min(1, "Project name is required"),
    projectDescription: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    projectGoal: z.string().min(1, "Project goal is required"),
    projectObjectives: z.string().optional(),
    targetBeneficiaries: z.string().optional(),
    projectLocation: z.string().optional(),
    estimatedBudget: z.string().optional(),
    regions: z.array(z.string()).min(1, "At least one region is required"),
    targetedNCDs: z.array(z.string()).min(1, "At least one NCD must be selected"),
    fundingSource: z.string().min(1, "Funding source is required"),
    ncdSpecificInfo: z.record(z.any()).optional(),
  }).optional(),
  
  projectActivities: z.object({
    districts: z.array(z.string()).optional(),
    continuumOfCare: z.array(z.string()).optional(),
    activityDescription: z.string().optional(),
    primaryTargetPopulation: z.string().optional(),
    secondaryTargetPopulation: z.string().optional(),
    ageRanges: z.array(z.string()).optional(),
    gender: z.enum(["male", "female", "both"]).optional(),
    implementationLevel: z.array(z.string()).optional(),
    implementationArea: z.enum(["urban", "rural", "both"]).optional(),
    whoGapTargets: z.array(z.string()).optional(),
    ncdStrategyDomain: z.string().optional(),
    preventionFocus: z.string().optional(),
    ncdActivities: z.record(z.any()).optional(),
  }).optional(),
  
  activities: z.array(z.object({
    name: z.string(),
    description: z.string(),
    timeline: z.string(),
    budget: z.number(),
  })).optional(),
  
  partners: z.array(z.object({
    organisationName: z.string(),
    role: z.string(),
    contribution: z.string(),
    contactPerson: z.string(),
    email: z.string().email(),
  })).optional(),
  
  risks: z.string().optional(),
  sustainability: z.string().optional(),
  monitoringPlan: z.string().optional(),
  evaluation: z.string().optional(),
  notes: z.string().optional(),
})

export interface SurveySubmissionResult {
  success: boolean
  surveyId?: string
  message: string
  errors?: Record<string, string> | null
}

export interface DraftInfo {
  _id: string
  userId: string
  lastSaved: Date
  formData: Partial<FormData>
  currentStep: string
  progress: number
}

function calculateFormProgress(formData: Partial<FormData>): number {
  let completedSections = 0
  const totalSections = 6
  
  // Organisation info
  if (formData.organisationInfo?.organisationName && 
      formData.organisationInfo?.region && 
      formData.organisationInfo?.email) {
    completedSections++
  }
  
  // Project info
  if (formData.projectInfo?.projectName && 
      formData.projectInfo?.startDate && 
      formData.projectInfo?.projectGoal) {
    completedSections++
  }
  
  // Project activities
  if (formData.projectActivities) {
    completedSections++
  }
  
  // Partners (optional)
  completedSections++ // Always count as complete since it's optional
  
  // Additional info
  if (formData.risks && formData.sustainability && formData.evaluation) {
    completedSections++
  }
  
  // Final (review)
  completedSections++ // Always count as complete for progress
  
  return Math.round((completedSections / totalSections) * 100)
}

export async function submitSurveyData(formData: FormData): Promise<SurveySubmissionResult> {
  try {
    console.log('Validating survey data...')
    
    // Get the authenticated user
    const session = await auth()
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Authentication required to submit survey'
      }
    }
    
    // Validate the form data
    const validatedData = surveyDataSchema.parse(formData)
    
    console.log('Survey data validated successfully')

    // Connect to MongoDB
    await client.connect()
    const db = client.db('ncd_navigator')
    const surveysCollection = db.collection('surveys')
    
    // Prepare the document for insertion
    const surveyDocument = {
      ...validatedData,
      userId: session.user.id,
      userEmail: session.user.email,
      submissionDate: new Date(),
      lastUpdated: new Date(),
      status: 'submitted',
      version: '1.0'
    }
    
    console.log('Inserting survey document into database...')
    
    // Insert the survey data
    const result = await surveysCollection.insertOne(surveyDocument)
    
    // Delete any existing drafts for this user after successful submission
    const draftsCollection = db.collection('survey_drafts')
    await draftsCollection.deleteMany({ userId: session.user.id })
    
    console.log('Survey submitted successfully with ID:', result.insertedId)
    
    return {
      success: true,
      surveyId: result.insertedId.toString(),
      message: 'Survey submitted successfully'
    }
    
  } catch (error) {
    console.error('Error submitting survey:', error)
    
    if (error instanceof z.ZodError) {
      // Handle validation errors
      const fieldErrors: Record<string, string> = {}
      error.errors.forEach((err) => {
        const fieldName = err.path.join('.')
        fieldErrors[fieldName] = err.message
      })
      
      return {
        success: false,
        message: 'Please check the form for validation errors',
        errors: fieldErrors
      }
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred while submitting the survey'
    }
  } finally {
    // Close the database connection
    await client.close()
  }
}

export async function saveSurveyDraft(formData: Partial<FormData>, currentStep?: string): Promise<SurveySubmissionResult> {
  try {
    console.log('Saving survey draft...')
    
    // Get the authenticated user
    const session = await auth()
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Authentication required to save draft'
      }
    }
    
    // Connect to MongoDB
    await client.connect()
    const db = client.db('ncd_navigator')
    const draftsCollection = db.collection('survey_drafts')
    
    // Calculate progress (simplified calculation)
    const progress = calculateFormProgress(formData)
    
    // Prepare the draft document
    const draftDocument = {
      userId: session.user.id,
      userEmail: session.user.email,
      formData,
      currentStep: currentStep || 'organisation',
      progress,
      lastSaved: new Date(),
      status: 'draft',
      version: '1.0'
    }
    
    // Try to update existing draft or create new one
    const result = await draftsCollection.replaceOne(
      { userId: session.user.id },
      draftDocument,
      { upsert: true }
    )
    
    console.log('Survey draft saved for user:', session.user.id)
    
    return {
      success: true,
      surveyId: result.upsertedId?.toString() || 'updated',
      message: 'Survey draft saved successfully'
    }
    
  } catch (error) {
    console.error('Error saving survey draft:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred while saving the draft'
    }
  } finally {
    await client.close()
  }
}

export async function getUserDraft(): Promise<{ success: boolean; draft?: DraftInfo; message: string }> {
  try {
    // Get the authenticated user
    const session = await auth()
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Authentication required to retrieve draft'
      }
    }
    
    await client.connect()
    const db = client.db('ncd_navigator')
    const draftsCollection = db.collection('survey_drafts')
    
    const draft = await draftsCollection.findOne({ userId: session.user.id })
    
    if (!draft) {
      return {
        success: false,
        message: 'No draft found for this user'
      }
    }
    
    return {
      success: true,
      draft: {
        _id: draft._id.toString(),
        userId: draft.userId,
        lastSaved: draft.lastSaved,
        formData: draft.formData,
        currentStep: draft.currentStep,
        progress: draft.progress
      },
      message: 'Draft retrieved successfully'
    }
    
  } catch (error) {
    console.error('Error retrieving draft:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred while retrieving the draft'
    }
  } finally {
    await client.close()
  }
}

export async function deleteDraft(): Promise<SurveySubmissionResult> {
  try {
    // Get the authenticated user
    const session = await auth()
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Authentication required to delete draft'
      }
    }
    
    await client.connect()
    const db = client.db('ncd_navigator')
    const draftsCollection = db.collection('survey_drafts')
    
    const result = await draftsCollection.deleteOne({ userId: session.user.id })
    
    if (result.deletedCount === 0) {
      return {
        success: false,
        message: 'No draft found to delete'
      }
    }
    
    return {
      success: true,
      message: 'Draft deleted successfully'
    }
    
  } catch (error) {
    console.error('Error deleting draft:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred while deleting the draft'
    }  } finally {
    await client.close()
  }
}

export async function getSurveyById(surveyId: string): Promise<{ success: boolean; data?: any; message: string }> {
  try {
    if (!ObjectId.isValid(surveyId)) {
      return {
        success: false,
        message: 'Invalid survey ID'
      }
    }
    
    await client.connect()
    const db = client.db('ncd_navigator')
    const surveysCollection = db.collection('surveys')
    
    const survey = await surveysCollection.findOne({ _id: new ObjectId(surveyId) })
    
    if (!survey) {
      return {
        success: false,
        message: 'Survey not found'
      }
    }
    
    return {
      success: true,
      data: survey,
      message: 'Survey retrieved successfully'
    }
    
  } catch (error) {
    console.error('Error retrieving survey:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred while retrieving the survey'
    }
  } finally {
    await client.close()
  }
}

export async function getAllSurveys(): Promise<{ success: boolean; data?: any[]; message: string; count?: number }> {
  try {
    await client.connect()
    const db = client.db('ncd_navigator')
    const surveysCollection = db.collection('surveys')
    
    const surveys = await surveysCollection.find({}).sort({ submissionDate: -1 }).toArray()
    
    return {
      success: true,
      data: surveys,
      count: surveys.length,
      message: 'Surveys retrieved successfully'
    }
    
  } catch (error) {
    console.error('Error retrieving surveys:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred while retrieving surveys'
    }
  } finally {
    await client.close()
  }
}

export async function updateSurveyData(surveyId: string, updateData: Partial<FormData>): Promise<SurveySubmissionResult> {
  try {
    if (!ObjectId.isValid(surveyId)) {
      return {
        success: false,
        message: 'Invalid survey ID'
      }
    }
    
    await client.connect()
    const db = client.db('ncd_navigator')
    const surveysCollection = db.collection('surveys')
    
    const updateDocument = {
      ...updateData,
      lastUpdated: new Date()
    }
    
    const result = await surveysCollection.updateOne(
      { _id: new ObjectId(surveyId) },
      { $set: updateDocument }
    )
    
    if (result.matchedCount === 0) {
      return {
        success: false,
        message: 'Survey not found'
      }
    }
    
    return {
      success: true,
      surveyId,
      message: 'Survey updated successfully'
    }
    
  } catch (error) {
    console.error('Error updating survey:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred while updating the survey'
    }
  } finally {
    await client.close()
  }
}

export async function deleteSurvey(surveyId: string): Promise<{ success: boolean; message: string }> {
  try {
    if (!ObjectId.isValid(surveyId)) {
      return {
        success: false,
        message: 'Invalid survey ID'
      }
    }
    
    await client.connect()
    const db = client.db('ncd_navigator')
    const surveysCollection = db.collection('surveys')
    
    const result = await surveysCollection.deleteOne({ _id: new ObjectId(surveyId) })
    
    if (result.deletedCount === 0) {
      return {
        success: false,
        message: 'Survey not found'
      }
    }
    
    return {
      success: true,
      message: 'Survey deleted successfully'
    }
    
  } catch (error) {
    console.error('Error deleting survey:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred while deleting the survey'
    }
  } finally {
    await client.close()
  }
}
