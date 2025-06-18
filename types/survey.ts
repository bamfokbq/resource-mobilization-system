
import { FormData as CustomFormData } from './forms';

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
  formData: Partial<CustomFormData>
  currentStep: string
  progress: number
}