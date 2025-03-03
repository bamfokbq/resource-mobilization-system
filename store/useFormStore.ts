import { create } from 'zustand';
import { FormStepId, formSteps } from '@/constant/formSteps';
import type { FormData } from '@/types/forms';
import { persist } from 'zustand/middleware';

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
}

const initialState: Pick<FormStore, 'activeForm' | 'isFirstStep' | 'isLastStep' | 'formData'> = {
  activeForm: 'organisation',
  isFirstStep: true,
  isLastStep: false,
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
