import { useForm } from 'react-hook-form'
import type { AdminProfile } from '@/types'
import { updateUserProfile } from '@/actions/users'

interface AdminProfileFormProps {
  defaultValues: {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    bio: string;
  };
  userId: string;
  onCancel: () => void;
}

export default function AdminProfileForm({ defaultValues, userId, onCancel }: AdminProfileFormProps) {
  const { register, formState: { errors, isSubmitting } } = useForm<AdminProfile>({
    defaultValues,
    mode: 'onBlur'
  });

  async function handleSubmit(formData: FormData) {
    try {
      formData.append('userId', userId);
      const result = await updateUserProfile(userId, formData);

      if (!result.success) {
        throw new Error(result.error);
      }
      onCancel();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }

  return (
    <form action={handleSubmit} className="p-4 sm:p-6 space-y-4">
      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-gray block">First Name</label>
          <input
            {...register("firstName")}
            name="firstName"
            required
            className="w-full p-2 sm:p-3 border rounded-lg bg-ligher-gray text-base sm:text-sm"
          />
          {errors.firstName && <span className="text-nobe-red text-xs sm:text-sm">{errors.firstName.message}</span>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-gray block">Last Name</label>
          <input
            {...register("lastName")}
            name="lastName"
            required
            className="w-full p-2 sm:p-3 border rounded-lg bg-ligher-gray text-base sm:text-sm"
          />
          {errors.lastName && <span className="text-nobe-red text-xs sm:text-sm">{errors.lastName.message}</span>}
        </div>
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-gray block">Email</label>
          <input
            name="email"
            defaultValue={defaultValues.email}
            disabled
            className="w-full p-2 sm:p-3 border rounded-lg bg-gray-100 text-base sm:text-sm cursor-not-allowed"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-gray block">Phone</label>
          <input
            {...register("telephone")}
            name="telephone"
            required
            className="w-full p-2 sm:p-3 border rounded-lg bg-ligher-gray text-base sm:text-sm"
          />
          {errors.telephone && <span className="text-nobe-red text-xs sm:text-sm">{errors.telephone.message}</span>}
        </div>
      </div>

      {/* Bio Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-gray block">Biography</label>
        <textarea
          {...register("bio")}
          name="bio"
          required
          className="w-full p-2 sm:p-3 border rounded-lg bg-ligher-gray min-h-[100px] text-base sm:text-sm"
        />
        {errors.bio && <span className="text-nobe-red text-xs sm:text-sm">{errors.bio.message}</span>}
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-ligher-gray text-dark-gray hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-navy-blue text-white hover:bg-navy-blue/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
