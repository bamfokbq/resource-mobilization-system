import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PartnerMappingData, PartnerMappingFormData } from '@/types/partner-mapping';
import { savePartnerMappingDraft, getPartnerMappingDraft, deletePartnerMappingDraft } from '@/actions/partnerMappingActions';

interface PartnerMappingStore {
  formData: PartnerMappingFormData;
  updateFormData: (data: Partial<PartnerMappingFormData>) => void;
  resetForm: () => void;
  saveAsDraft: () => Promise<boolean>;
  loadUserDraft: () => Promise<boolean>;
  clearDraft: () => Promise<boolean>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  hasDraft: boolean;
  setHasDraft: (hasDraft: boolean) => void;
}

const initialState: Pick<PartnerMappingStore, 'formData' | 'isLoading' | 'hasDraft'> = {
  formData: {
    partnerMappings: []
  },
  isLoading: false,
  hasDraft: false,
};

export const usePartnerMappingStore = create<PartnerMappingStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      updateFormData: (data) => set((state) => ({
        formData: {
          ...state.formData,
          ...data,
        }
      })),
      
      resetForm: () => set(initialState),
      
      saveAsDraft: async () => {
        const { formData } = get();
        set({ isLoading: true });
        
        try {
          const result = await savePartnerMappingDraft(formData);
          if (result.success) {
            set({ hasDraft: true });
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
          const result = await getPartnerMappingDraft();
          if (result.success && result.draft) {
            set({
              formData: result.draft.formData,
              hasDraft: true,
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
          const result = await deletePartnerMappingDraft();
          if (result.success) {
            set({ 
              hasDraft: false,
              formData: { partnerMappings: [] }
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
      
      setHasDraft: (hasDraft: boolean) => set({ hasDraft }),
    }),
    {
      name: 'partner-mapping-storage',
      partialize: (state) => ({ 
        formData: state.formData 
      }),
    }
  )
);
