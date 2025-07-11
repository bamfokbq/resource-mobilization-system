
import { FormData as CustomFormData } from './forms';

export interface SurveySubmissionResult {
  success: boolean
  surveyId?: string
  message: string
  errors?: Record<string, string> | null
}

export interface DraftInfo {
  _id: string
  createdBy: {
    userId: string
    email: string
    name: string
    timestamp: string // ISO string
  }
  lastSaved: string // ISO string
  formData: Partial<CustomFormData>
  currentStep: string
  progress: number
}