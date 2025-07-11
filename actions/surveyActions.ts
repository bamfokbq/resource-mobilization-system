'use server'

import { z } from 'zod'
import { getDb } from '@/lib/db'
import { FormData } from '@/types/forms'
import { ObjectId } from 'mongodb'
import { auth } from '@/auth'
import { DraftInfo, SurveySubmissionResult } from '@/types/survey'

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
    const db = await getDb()
    const surveysCollection = db.collection('surveys')
    // Prepare the document for insertion
    const surveyDocument = {
      ...validatedData,
      createdBy: {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name || '',
        timestamp: new Date()
      },
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
    await draftsCollection.deleteMany({ 'createdBy.userId': session.user.id })
    
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
    
    const db = await getDb()
    const draftsCollection = db.collection('survey_drafts')
    
    // Calculate progress (simplified calculation)
    const progress = calculateFormProgress(formData)
    // Prepare the draft document
    const draftDocument = {
      createdBy: {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name || '',
        timestamp: new Date()
      },
      formData,
      currentStep: currentStep || 'organisation',
      progress,
      lastSaved: new Date(),
      status: 'draft',
      version: '1.0'
    }
    // Try to update existing draft or create new one
    const result = await draftsCollection.replaceOne(
      { 'createdBy.userId': session.user.id },
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
    
    const db = await getDb()
    const draftsCollection = db.collection('survey_drafts')
    
    const draft = await draftsCollection.findOne({ 'createdBy.userId': session.user.id })
    
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
        createdBy: {
          ...draft.createdBy,
          timestamp: draft.createdBy?.timestamp?.toISOString() || new Date().toISOString()
        },
        lastSaved: draft.lastSaved?.toISOString() || new Date().toISOString(),
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
    

    const db = await getDb()
    const draftsCollection = db.collection('survey_drafts')
    
    const result = await draftsCollection.deleteOne({ 'createdBy.userId': session.user.id })
    
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
    

    const db = await getDb()
    const surveysCollection = db.collection('surveys')
    
    const survey = await surveysCollection.findOne({ _id: new ObjectId(surveyId) })
    
    if (!survey) {
      return {
        success: false,
        message: 'Survey not found'
      }
    }

    // Serialize the survey data to remove ObjectId and Date serialization issues
    const serializedSurvey = {
      ...survey,
      _id: survey._id.toString(), // Convert ObjectId to string
      submissionDate: survey.submissionDate?.toISOString() || new Date().toISOString(),
      lastUpdated: survey.lastUpdated?.toISOString() || new Date().toISOString(),
      createdBy: {
        ...survey.createdBy,
        timestamp: survey.createdBy?.timestamp?.toISOString() || new Date().toISOString()
      }
    }

    return {
      success: true,
      data: serializedSurvey,
      message: 'Survey retrieved successfully'
    }
    
  } catch (error) {
    console.error('Error retrieving survey:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred while retrieving the survey'
    }
  } finally {

  }
}

export async function getAllSurveys(): Promise<{ success: boolean; data?: any[]; message: string; count?: number }> {
  try {
    const db = await getDb()
    const surveysCollection = db.collection('surveys')
    
    const surveys = await surveysCollection.find({}).sort({ submissionDate: -1 }).toArray()
    
    // Serialize the data to remove ObjectId and Date serialization issues
    const serializedSurveys = surveys.map(survey => ({
      ...survey,
      _id: survey._id.toString(), // Convert ObjectId to string
      submissionDate: survey.submissionDate?.toISOString() || new Date().toISOString(),
      lastUpdated: survey.lastUpdated?.toISOString() || new Date().toISOString(),
      createdBy: {
        ...survey.createdBy,
        timestamp: survey.createdBy?.timestamp?.toISOString() || new Date().toISOString()
      }
    }))

    return {
      success: true,
      data: serializedSurveys,
      count: serializedSurveys.length,
      message: 'Surveys retrieved successfully'
    }
    
  } catch (error) {
    console.error('Error retrieving surveys:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred while retrieving surveys'
    }
  }
}

export async function getUserSurveys(userId: string): Promise<{ success: boolean; data?: any[]; message: string; count?: number }> {
  try {
    const db = await getDb()
    const surveysCollection = db.collection('surveys')
    
    const surveys = await surveysCollection.find({ 'createdBy.userId': userId }).sort({ submissionDate: -1 }).toArray()
    
    // Serialize the data to remove ObjectId and Date serialization issues
    const serializedSurveys = surveys.map(survey => ({
      ...survey,
      _id: survey._id.toString(), // Convert ObjectId to string
      submissionDate: survey.submissionDate?.toISOString() || new Date().toISOString(),
      lastUpdated: survey.lastUpdated?.toISOString() || new Date().toISOString(),
      createdBy: {
        ...survey.createdBy,
        timestamp: survey.createdBy?.timestamp?.toISOString() || new Date().toISOString()
      }
    }))

    return {
      success: true,
      data: serializedSurveys,
      count: serializedSurveys.length,
      message: 'User surveys retrieved successfully'
    }
    
  } catch (error) {
    console.error('Error retrieving user surveys:', error)
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred while retrieving user surveys'
    }
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
    

    const db = await getDb()
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
    

    const db = await getDb()
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

  }
}

// Analytics functions for dashboard
export async function getSurveyAnalytics(userId?: string): Promise<{
  success: boolean;
  data?: {
    surveyMetrics: Array<{ month: string; submitted: number; draft: number; total: number }>;
    statusData: Array<{ name: string; value: number; color: string }>;
    progressData: Array<{ step: string; completion: number; users: number }>;
    timelineData: Array<{ date: string; progress: number; target: number }>;
    regionalData: Array<{
      region: string;
      surveys: number;
      completion: number;
      engagement: number;
      satisfaction: number;
      efficiency: number;
      impact: number;
    }>;
    effortData: Array<{ complexity: number; completion: number; region: string; surveys: number }>;
  };
  message: string;
}> {
  try {
    const db = await getDb();
    const surveysCollection = db.collection('surveys');
    const draftsCollection = db.collection('survey_drafts');

    // Build filter based on userId if provided
    const surveyFilter = userId ? { 'createdBy.userId': userId } : {};
    const draftFilter = userId ? { 'createdBy.userId': userId } : {};

    // Get surveys and drafts filtered by user if userId is provided
    const [allSurveys, allDrafts] = await Promise.all([
      surveysCollection.find(surveyFilter).toArray(),
      draftsCollection.find(draftFilter).toArray()
    ]);

    // Calculate survey metrics by month
    const surveyMetrics = generateSurveyMetricsFromData(allSurveys);

    // Calculate status distribution
    const statusData = [
      { name: 'Completed', value: allSurveys.filter((s: any) => s.status === 'submitted').length, color: '#10B981' },
      { name: 'In Progress', value: allDrafts.length, color: '#F59E0B' },
      { name: 'Draft', value: allDrafts.length, color: '#6B7280' }
    ];

    // Calculate step completion rates
    const progressData = calculateStepCompletionRates(allSurveys, allDrafts);

    // Generate timeline data (actual submission trends over time)
    const timelineData = generateTimelineFromData(allSurveys);

    // Calculate regional insights
    const regionalData = calculateRegionalInsights(allSurveys);

    // Calculate effort vs completion correlation
    const effortData = calculateEffortAnalysis(allSurveys);

    return {
      success: true,
      data: {
        surveyMetrics,
        statusData,
        progressData,
        timelineData,
        regionalData,
        effortData
      },
      message: 'Analytics data generated successfully'
    };
  } catch (error) {
    console.error('Error generating analytics:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to generate analytics data'
    };
  }
}

function generateSurveyMetricsFromData(surveys: any[]): Array<{ month: string; submitted: number; draft: number; total: number }> {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const currentDate = new Date();

  return months.map((month, index) => {
    const monthDate = new Date(currentDate.getFullYear(), index, 1);
    const nextMonthDate = new Date(currentDate.getFullYear(), index + 1, 1);

    const monthSurveys = surveys.filter(survey => {
      const submissionDate = new Date(survey.submissionDate);
      return submissionDate >= monthDate && submissionDate < nextMonthDate;
    });

    const submitted = monthSurveys.filter(s => s.status === 'submitted').length;
    const total = monthSurveys.length;

    return {
      month,
      submitted,
      draft: Math.max(0, total - submitted),
      total
    };
  });
}

function calculateStepCompletionRates(surveys: any[], drafts: any[]): Array<{ step: string; completion: number; users: number }> {
  const steps = [
    { key: 'organisationInfo', name: 'Organization Info' },
    { key: 'projectInfo', name: 'Project Info' },
    { key: 'projectActivities', name: 'Activities' },
    { key: 'partners', name: 'Partners' },
    { key: 'sustainability', name: 'Background' }
  ];

  return steps.map(step => {
    // Count completed surveys (they have all steps completed)
    const completedWithStep = surveys.filter(survey =>
      survey[step.key] && Object.keys(survey[step.key]).length > 0
    ).length;

    // Count drafts with this step
    const draftsWithStep = drafts.filter(draft =>
      draft.formData?.[step.key] && Object.keys(draft.formData[step.key]).length > 0
    ).length;

    const totalUsers = surveys.length + drafts.length;
    const usersWithStep = completedWithStep + draftsWithStep;

    return {
      step: step.name,
      completion: totalUsers > 0 ? Math.round((usersWithStep / totalUsers) * 100) : 0,
      users: usersWithStep
    };
  });
}

function generateTimelineFromData(surveys: any[]): Array<{ date: string; progress: number; target: number }> {
  const timeline = [];
  const today = new Date();

  // Generate last 30 days of data
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Count surveys submitted up to this date
    const surveysUpToDate = surveys.filter(survey => {
      const submissionDate = new Date(survey.submissionDate);
      return submissionDate <= date;
    }).length;

    // Calculate progress as percentage of total surveys
    const totalSurveys = surveys.length;
    const progress = totalSurveys > 0 ? (surveysUpToDate / totalSurveys) * 100 : 0;

    // Set a reasonable target based on time progression
    const daysFromStart = 30 - i;
    const target = Math.min(100, (daysFromStart / 30) * 100);

    timeline.push({
      date: dateStr,
      progress: Math.round(progress),
      target: Math.round(target)
    });
  }

  return timeline;
}

function calculateRegionalInsights(surveys: any[]): Array<{
  region: string;
  surveys: number;
  completion: number;
  engagement: number;
  satisfaction: number;
  efficiency: number;
  impact: number
}> {
  const regionStats = new Map();

  surveys.forEach(survey => {
    const region = survey.organisationInfo?.region || 'Unknown';

    if (!regionStats.has(region)) {
      regionStats.set(region, {
        region,
        surveys: 0,
        completed: 0,
        totalActivities: 0,
        totalPartners: 0
      });
    }

    const stats = regionStats.get(region);
    stats.surveys++;

    if (survey.status === 'submitted') {
      stats.completed++;
    }

    // Count activities and partners for engagement metrics
    if (survey.activities?.length) {
      stats.totalActivities += survey.activities.length;
    }
    if (survey.partners?.length) {
      stats.totalPartners += survey.partners.length;
    }
  });

  return Array.from(regionStats.values()).map(stats => {
    const completion = stats.surveys > 0 ? (stats.completed / stats.surveys) * 100 : 0;
    const avgActivities = stats.surveys > 0 ? stats.totalActivities / stats.surveys : 0;
    const avgPartners = stats.surveys > 0 ? stats.totalPartners / stats.surveys : 0;

    return {
      region: stats.region,
      surveys: stats.surveys,
      completion: Math.round(completion),
      engagement: Math.min(100, Math.round(avgActivities * 10)), // Scale activities to 0-100
      satisfaction: Math.min(100, Math.round(completion + Math.random() * 10)), // Mock satisfaction based on completion
      efficiency: Math.min(100, Math.round(avgPartners * 20)), // Scale partners to 0-100
      impact: Math.min(100, Math.round((completion + avgActivities * 5) / 2)) // Combined metric
    };
  });
}

function calculateEffortAnalysis(surveys: any[]): Array<{ complexity: number; completion: number; region: string; surveys: number }> {
  const regionStats = calculateRegionalInsights(surveys);

  return regionStats.map(stats => {
    // Calculate complexity based on number of activities, partners, and project scope
    const avgSurvey = surveys.find(s => s.organisationInfo?.region === stats.region);
    let complexity = 2.0; // Base complexity

    if (avgSurvey) {
      // Add complexity based on various factors
      if (avgSurvey.activities?.length > 5) complexity += 0.5;
      if (avgSurvey.partners?.length > 3) complexity += 0.3;
      if (avgSurvey.projectInfo?.regions?.length > 1) complexity += 0.4;
      if (avgSurvey.projectInfo?.targetedNCDs?.length > 2) complexity += 0.3;
    }

    return {
      complexity: Math.round(complexity * 10) / 10, // Round to 1 decimal
      completion: stats.completion,
      region: stats.region,
      surveys: stats.surveys
    };
  });
}

export async function getUserSurveyStatistics(userId: string): Promise<{
  success: boolean;
  data?: {
    totalSurveys: number;
    completedSurveys: number;
    averageCompletion: number;
    totalUsers: number;
    completionRate: number;
  };
  message: string;
}> {
  try {
    const db = await getDb();
    const surveysCollection = db.collection('surveys');
    const draftsCollection = db.collection('survey_drafts');

    // Get user's surveys and overall statistics
    const [userSurveys, allSurveys, userDraft] = await Promise.all([
      surveysCollection.find({ 'createdBy.userId': userId }).toArray(),
      surveysCollection.find({}).toArray(),
      draftsCollection.findOne({ 'createdBy.userId': userId })
    ]);

    const totalSurveys = userSurveys.length;
    const completedSurveys = userSurveys.filter((s: any) => s.status === 'submitted').length;
    const completionRate = totalSurveys > 0 ? (completedSurveys / totalSurveys) * 100 : 0;

    // Calculate average completion across all users
    const totalUsersSet = new Set();
    allSurveys.forEach((survey: any) => {
      if (survey.createdBy?.userId) {
        totalUsersSet.add(survey.createdBy.userId);
      }
    });

    const averageCompletion = userDraft?.progress ||
      (completedSurveys > 0 ? 100 : (totalSurveys > 0 ? 50 : 0));

    return {
      success: true,
      data: {
        totalSurveys,
        completedSurveys,
        averageCompletion,
        totalUsers: totalUsersSet.size,
        completionRate: Math.round(completionRate)
      },
      message: 'User statistics calculated successfully'
    };
  } catch (error) {
    console.error('Error calculating user statistics:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to calculate user statistics'
    };
  }
}

// Predictive analytics function
export async function getPredictiveAnalytics(userId?: string): Promise<{
  success: boolean;
  data?: {
    predictionData: Array<{
      date: string;
      actual: number | null;
      predicted: number;
      confidence: { lower: number; upper: number };
      target: number;
    }>;
    milestones: Array<{ date: string; label: string; value: number }>;
    projectedCompletion: number;
    timeToTarget: number;
    confidenceLevel: number;
  };
  message: string;
}> {
  try {
    const db = await getDb();
    const surveysCollection = db.collection('surveys');
    const draftsCollection = db.collection('survey_drafts');

    // Build filter based on userId if provided
    const surveyFilter = userId ? { 'createdBy.userId': userId } : {};
    const draftFilter = userId ? { 'createdBy.userId': userId } : {};

    // Get recent survey data for predictions filtered by user if userId is provided
    const [surveys, drafts] = await Promise.all([
      surveysCollection.find(surveyFilter).sort({ submissionDate: -1 }).limit(100).toArray(),
      draftsCollection.find(draftFilter).toArray()
    ]);

    // Calculate basic predictive metrics
    const totalUsers = new Set([
      ...surveys.map((s: any) => s.createdBy?.userId),
      ...drafts.map((d: any) => d.createdBy?.userId)
    ]).size;

    const completedSurveys = surveys.filter((s: any) => s.status === 'submitted').length;
    const avgCompletionRate = surveys.length > 0 ? (completedSurveys / surveys.length) * 100 : 0;

    // Generate timeline predictions based on actual data trends
    const predictionData = generatePredictionsFromData(surveys);

    // Calculate realistic milestones based on current progress
    const milestones = generateMilestonesFromData(surveys, drafts);

    // Project completion metrics
    const projectedCompletion = Math.min(100, Math.round(avgCompletionRate + (drafts.length * 10)));
    const timeToTarget = Math.max(1, Math.round(30 - (avgCompletionRate / 100) * 30));
    const confidenceLevel = Math.min(95, Math.round(60 + (surveys.length / 10) * 5));

    return {
      success: true,
      data: {
        predictionData,
        milestones,
        projectedCompletion,
        timeToTarget,
        confidenceLevel
      },
      message: 'Predictive analytics generated successfully'
    };
  } catch (error) {
    console.error('Error generating predictive analytics:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to generate predictive analytics'
    };
  }
}

function generatePredictionsFromData(surveys: any[]): Array<{
  date: string;
  actual: number | null;
  predicted: number;
  confidence: { lower: number; upper: number };
  target: number;
}> {
  const data = [];
  const today = new Date();

  // Analyze historical submission patterns
  const submissionsByDay = new Map();
  surveys.forEach(survey => {
    if (survey.submissionDate) {
      const date = new Date(survey.submissionDate).toISOString().split('T')[0];
      submissionsByDay.set(date, (submissionsByDay.get(date) || 0) + 1);
    }
  });

  // Generate last 30 days with actual data
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const actualSubmissions = submissionsByDay.get(dateStr) || 0;
    const cumulativeActual = Array.from(submissionsByDay.entries())
      .filter(([d]) => d <= dateStr)
      .reduce((sum, [, count]) => sum + count, 0);

    const progress = surveys.length > 0 ? (cumulativeActual / surveys.length) * 100 : 0;
    const predicted = Math.min(100, progress + Math.random() * 5 - 2.5);

    data.push({
      date: dateStr,
      actual: Math.round(progress),
      predicted: Math.round(predicted),
      confidence: {
        lower: Math.max(0, Math.round(predicted - 10)),
        upper: Math.min(100, Math.round(predicted + 10))
      },
      target: Math.min(100, (30 - i) * 3.33) // Linear target progression
    });
  }

  // Generate future predictions
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    // Base prediction on current trend
    const lastDataPoint = data[data.length - 1];
    const currentProgress: number = lastDataPoint?.actual || 0;
    const predicted = Math.min(100, currentProgress + i * 1.5 + Math.random() * 10 - 5);

    data.push({
      date: dateStr,
      actual: null,
      predicted: Math.round(predicted),
      confidence: {
        lower: Math.max(0, Math.round(predicted - 15)),
        upper: Math.min(100, Math.round(predicted + 15))
      },
      target: Math.min(100, currentProgress + i * 2.33)
    });
  }

  return data;
}

function generateMilestonesFromData(surveys: any[], drafts: any[]): Array<{ date: string; label: string; value: number }> {
  const today = new Date();
  const milestones = [];

  // Calculate realistic milestones based on current data
  const totalUsers = new Set([
    ...surveys.map(s => s.createdBy?.userId),
    ...drafts.map(d => d.createdBy?.userId)
  ]).size;

  const completionRate = surveys.length > 0 ? (surveys.filter(s => s.status === 'submitted').length / surveys.length) * 100 : 0;

  // Milestone 1: Short-term target (1 week)
  milestones.push({
    date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    label: 'Weekly Target',
    value: Math.min(100, Math.round(completionRate + 15))
  });

  // Milestone 2: Medium-term target (3 weeks)
  milestones.push({
    date: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    label: 'Monthly Review',
    value: Math.min(100, Math.round(completionRate + 35))
  });

  // Milestone 3: Long-term target (6 weeks)
  if (completionRate < 70) {
    milestones.push({
      date: new Date(today.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      label: 'Project Completion',
      value: 100
    });
  }

  return milestones;
}

// Get comprehensive survey statistics
export async function getSurveyStats() {
  try {
    const db = await getDb()

    // Get total submitted surveys
    const totalSubmittedSurveys = await db.collection('surveys').countDocuments({
      status: 'submitted'
    })

    // Get total draft surveys  
    const totalDraftSurveys = await db.collection('survey_drafts').countDocuments()

    // Get recent surveys (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentSubmissions = await db.collection('surveys').countDocuments({
      submissionDate: { $gte: thirtyDaysAgo },
      status: 'submitted'
    })

    // Get surveys by region
    const surveysByRegion = await db.collection('surveys').aggregate([
      { $match: { status: 'submitted' } },
      { $group: { _id: '$organisationInfo.region', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray()

    // Get completion rate
    const totalAttempts = totalSubmittedSurveys + totalDraftSurveys
    const completionRate = totalAttempts > 0 ? Math.round((totalSubmittedSurveys / totalAttempts) * 100) : 0

    return {
      totalSubmittedSurveys,
      totalDraftSurveys,
      recentSubmissions,
      completionRate,
      totalAttempts,
      surveysByRegion: surveysByRegion.map(item => ({
        region: item._id || 'Unknown',
        count: item.count
      }))
    }
  } catch (error) {
    console.error("Failed to fetch survey stats:", error)
    return {
      totalSubmittedSurveys: 0,
      totalDraftSurveys: 0,
      recentSubmissions: 0,
      completionRate: 0,
      totalAttempts: 0,
      surveysByRegion: []
    }
  }
}
