import { create } from 'zustand';
import { FormStepId, formSteps } from '@/constant/formSteps';
import type { FormData } from '@/types/forms';
import { persist } from 'zustand/middleware';
import { saveSurveyDraft, getUserDraft, deleteDraft, DraftInfo } from '@/actions/surveyActions';

interface FormStore {
  activeForm: FormStepId;
  setActiveForm: (form: FormStepId) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
  isFormValid: (stepId: FormStepId) => boolean;
  getFormProgress: () => number;
  saveAsDraft: () => Promise<boolean>;
  loadUserDraft: () => Promise<boolean>;
  clearDraft: () => Promise<boolean>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  validationErrors: Record<string, string[]>;
  setValidationErrors: (errors: Record<string, string[]>) => void;
  clearValidationErrors: () => void;
  draftInfo: DraftInfo | null;
  setDraftInfo: (draft: DraftInfo | null) => void;
  hasDraft: boolean;
}

const initialState: Pick<FormStore, 'activeForm' | 'isFirstStep' | 'isLastStep' | 'formData' | 'isLoading' | 'validationErrors' | 'draftInfo' | 'hasDraft'> = {
  activeForm: 'organisation',
  isFirstStep: true,
  isLastStep: false,
  isLoading: false,
  validationErrors: {},
  draftInfo: null,
  hasDraft: false,
  formData: {
    projectInfo: undefined,
    organisationInfo: undefined,
    projectActivities: undefined,
    activities: undefined,
    partners: undefined,
    risks: undefined,
    sustainability: undefined,
    monitoringPlan: undefined,
    evaluation: undefined,
    notes: undefined
  },
};

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setActiveForm: (form) => set({ 
        activeForm: form,
        isFirstStep: formSteps.findIndex(f => f.id === form) === 0,
        isLastStep: formSteps.findIndex(f => f.id === form) === formSteps.length - 1
      }),
      handleNext: () => {
        const currentIndex = formSteps.findIndex(form => form.id === get().activeForm);
        if (currentIndex < formSteps.length - 1) {
          const nextForm = formSteps[currentIndex + 1].id;
          get().setActiveForm(nextForm);
        }
      },
      handlePrevious: () => {
        const currentIndex = formSteps.findIndex(form => form.id === get().activeForm);
        if (currentIndex > 0) {
          const previousForm = formSteps[currentIndex - 1].id;
          get().setActiveForm(previousForm);
        }
      },
      updateFormData: (data) => set((state) => ({
        formData: {
          ...state.formData,
          ...data,
          // Ensure nested objects are properly merged
          projectActivities: data.projectActivities
            ? { ...state.formData.projectActivities, ...data.projectActivities }
            : state.formData.projectActivities
        }
      })),
      resetForm: () => set(initialState),
      
      isFormValid: (stepId: FormStepId) => {
        const { formData } = get();
        
        switch (stepId) {
          case 'organisation':
            return !!(
              formData.organisationInfo?.organisationName &&
              formData.organisationInfo?.region &&
              formData.organisationInfo?.email &&
              formData.organisationInfo?.hqPhoneNumber &&
              formData.organisationInfo?.sector
            );
            
          case 'project':
            return !!(
              formData.projectInfo?.projectName &&
              formData.projectInfo?.startDate &&
              formData.projectInfo?.projectGoal &&
              formData.projectInfo?.regions?.length &&
              formData.projectInfo?.targetedNCDs?.length &&
              formData.projectInfo?.fundingSource
            );
            
          case 'activities':
            return !!(formData.projectActivities);
            
          case 'partners':
            return true; // Partners are optional
            
          case 'additional':
            return !!(
              formData.risks &&
              formData.sustainability &&
              formData.evaluation
            );
            
          case 'final':
            return true; // Final step is just review
            
          default:
            return false;
        }
      },
      
      getFormProgress: () => {
        const validSteps = formSteps.filter(step => get().isFormValid(step.id)).length;
        return Math.round((validSteps / formSteps.length) * 100);
      },
        saveAsDraft: async () => {
        const { formData, activeForm } = get();
        set({ isLoading: true });
        
        try {
          const result = await saveSurveyDraft(formData, activeForm);
          if (result.success) {
            // Update draft info after successful save
            const draftResult = await getUserDraft();
            if (draftResult.success && draftResult.draft) {
              set({ 
                draftInfo: draftResult.draft,
                hasDraft: true 
              });
            }
          }
          return result.success;
        } catch (error) {
          console.error('Failed to save draft:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      loadUserDraft: async () => {
        set({ isLoading: true });
        
        try {
          const result = await getUserDraft();
          if (result.success && result.draft) {
            set({
              formData: result.draft.formData,
              activeForm: (result.draft.currentStep as FormStepId) || 'organisation',
              draftInfo: result.draft,
              hasDraft: true,
              isFirstStep: formSteps.findIndex(f => f.id === result.draft?.currentStep) === 0,
              isLastStep: formSteps.findIndex(f => f.id === result.draft?.currentStep) === formSteps.length - 1
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to load draft:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      clearDraft: async () => {
        set({ isLoading: true });
        
        try {
          const result = await deleteDraft();
          if (result.success) {
            set({ 
              draftInfo: null,
              hasDraft: false 
            });
          }
          return result.success;
        } catch (error) {
          console.error('Failed to clear draft:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
        setIsLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setValidationErrors: (errors: Record<string, string[]>) => set({ validationErrors: errors }),
      
      clearValidationErrors: () => set({ validationErrors: {} }),

      setDraftInfo: (draft: DraftInfo | null) => set({ 
        draftInfo: draft,
        hasDraft: !!draft 
      }),
    }),
    {
      name: 'form-storage',
      partialize: (state) => ({ 
        activeForm: state.activeForm,
        formData: state.formData 
      }),
    }
  )
);
