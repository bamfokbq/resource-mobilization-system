'use server';

import { PartnerMappingFormData, PartnerMappingSubmissionResult, PartnerMappingDraft, PartnerMappingDraftResult } from '@/types/partner-mapping';
import { partnerMappingFormSchema } from '@/schemas/partnerMappingSchema';
import { auth } from '@/auth';
import { getDb } from '@/lib/db';

export async function submitPartnerMappingData(formData: PartnerMappingFormData): Promise<PartnerMappingSubmissionResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Authentication required',
      };
    }

    // Validate the form data
    const validationResult = partnerMappingFormSchema.safeParse(formData);
    
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const validatedData = validationResult.data;

    // Save to database
    const db = await getDb();
    const partnerMappingsCollection = db.collection('partner_mappings');
    
    const partnerMappingDocument = {
      userId: session.user.id,
      data: validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'submitted',
    };
    
    const result = await partnerMappingsCollection.insertOne(partnerMappingDocument);
    const partnerMappingId = result.insertedId.toString();

    return {
      success: true,
      message: 'Partner mapping submitted successfully',
      partnerMappingId: partnerMappingId,
    };

  } catch (error) {
    console.error('Error submitting partner mapping:', error);
    return {
      success: false,
      message: 'Failed to submit partner mapping. Please try again.',
    };
  }
}

export async function savePartnerMappingDraft(formData: PartnerMappingFormData): Promise<PartnerMappingDraftResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Authentication required',
      };
    }

    const db = await getDb();
    const draftsCollection = db.collection('partner_mapping_drafts');
    
    // Check if draft exists
    const existingDraft = await draftsCollection.findOne({
      userId: session.user.id,
    });

    if (existingDraft) {
      // Update existing draft
      const updatedDraft = await draftsCollection.findOneAndUpdate(
        { _id: existingDraft._id },
        {
          $set: {
            formData,
            lastUpdated: new Date(),
          },
        },
        { returnDocument: 'after' }
      );

      if (!updatedDraft) {
        return {
          success: false,
          message: 'Failed to update draft. Please try again.',
        };
      }

      return {
        success: true,
        draft: {
          id: updatedDraft._id.toString(),
          userId: updatedDraft.userId,
          formData: updatedDraft.formData as PartnerMappingFormData,
          currentStep: updatedDraft.currentStep,
          lastUpdated: updatedDraft.lastUpdated instanceof Date ? updatedDraft.lastUpdated.toISOString() : new Date(updatedDraft.lastUpdated).toISOString(),
          createdAt: updatedDraft.createdAt instanceof Date ? updatedDraft.createdAt.toISOString() : new Date(updatedDraft.createdAt).toISOString(),
        },
      };
    } else {
      // Create new draft
      const newDraft = {
        userId: session.user.id,
        formData,
        currentStep: 'partner-mapping',
        lastUpdated: new Date(),
        createdAt: new Date(),
      };
      
      const result = await draftsCollection.insertOne(newDraft);
      const insertedDraft = await draftsCollection.findOne({ _id: result.insertedId });

      if (!insertedDraft) {
        return {
          success: false,
          message: 'Failed to create draft. Please try again.',
        };
      }

      return {
        success: true,
        draft: {
          id: insertedDraft._id.toString(),
          userId: insertedDraft.userId,
          formData: insertedDraft.formData as PartnerMappingFormData,
          currentStep: insertedDraft.currentStep,
          lastUpdated: insertedDraft.lastUpdated instanceof Date ? insertedDraft.lastUpdated.toISOString() : new Date(insertedDraft.lastUpdated).toISOString(),
          createdAt: insertedDraft.createdAt instanceof Date ? insertedDraft.createdAt.toISOString() : new Date(insertedDraft.createdAt).toISOString(),
        },
      };
    }

  } catch (error) {
    console.error('Error saving partner mapping draft:', error);
    return {
      success: false,
      message: 'Failed to save draft. Please try again.',
    };
  }
}

export async function getPartnerMappingDraft(): Promise<PartnerMappingDraftResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Authentication required',
      };
    }

    const db = await getDb();
    const draftsCollection = db.collection('partner_mapping_drafts');
    
    const draft = await draftsCollection.findOne(
      { userId: session.user.id },
      { sort: { lastUpdated: -1 } }
    );

    if (!draft) {
      return {
        success: false,
        message: 'No draft found',
      };
    }

    return {
      success: true,
      draft: {
        id: draft._id.toString(),
        userId: draft.userId,
        formData: draft.formData as PartnerMappingFormData,
        currentStep: draft.currentStep,
        lastUpdated: draft.lastUpdated instanceof Date ? draft.lastUpdated.toISOString() : new Date(draft.lastUpdated).toISOString(),
        createdAt: draft.createdAt instanceof Date ? draft.createdAt.toISOString() : new Date(draft.createdAt).toISOString(),
      },
    };

  } catch (error) {
    console.error('Error getting partner mapping draft:', error);
    return {
      success: false,
      message: 'Failed to load draft. Please try again.',
    };
  }
}

export async function deletePartnerMappingDraft(): Promise<{ success: boolean; message?: string }> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Authentication required',
      };
    }

    const db = await getDb();
    const draftsCollection = db.collection('partner_mapping_drafts');
    
    await draftsCollection.deleteMany({
      userId: session.user.id,
    });

    return {
      success: true,
      message: 'Draft deleted successfully',
    };

  } catch (error) {
    console.error('Error deleting partner mapping draft:', error);
    return {
      success: false,
      message: 'Failed to delete draft. Please try again.',
    };
  }
}

export async function getPartnerMappings(): Promise<{
  success: boolean;
  partnerMappings?: any[];
  message?: string;
}> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Authentication required',
      };
    }

    const db = await getDb();
    const partnerMappingsCollection = db.collection('partner_mappings');
    
    const partnerMappings = await partnerMappingsCollection.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 }).toArray();

    // Serialize MongoDB objects for client consumption
    const serializedPartnerMappings = partnerMappings.map(mapping => ({
      id: mapping._id.toString(),
      userId: mapping.userId,
      data: mapping.data,
      createdAt: mapping.createdAt instanceof Date ? mapping.createdAt.toISOString() : new Date(mapping.createdAt).toISOString(),
      updatedAt: mapping.updatedAt instanceof Date ? mapping.updatedAt.toISOString() : new Date(mapping.updatedAt).toISOString(),
      status: mapping.status,
    }));

    return {
      success: true,
      partnerMappings: serializedPartnerMappings,
    };

  } catch (error) {
    console.error('Error getting partner mappings:', error);
    return {
      success: false,
      message: 'Failed to load partner mappings. Please try again.',
    };
  }
}
