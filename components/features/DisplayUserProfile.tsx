"use client";
import { useUserStore } from '@/store/userStore';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { BsPersonVcard } from 'react-icons/bs';
import { FiEdit3, FiMail, FiPhone, FiUser, FiSave, FiX } from 'react-icons/fi';
import { MdOutlineBiotech } from 'react-icons/md';
import { updateUserEditableProfile } from '@/actions/users';
import { toast } from 'sonner';

interface FormInputs {
  telephone: string;
  bio: string;
}

export default function DisplayUserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Separate selectors to avoid object creation on every render
  const userInfo = useUserStore((state) => state.userInfo);
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();
  const onSubmit = useCallback(async (data: FormInputs) => {
    if (!userInfo || !userInfo._id) {
      toast.error('User information not available');
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the server action to update user profile with just the editable fields
      const result = await updateUserEditableProfile(userInfo._id, data.telephone, data.bio);

      if (result.success) {
        // Update the user store with new data
        setUserInfo({
          ...userInfo,
          telephone: data.telephone,
          bio: data.bio,
        });

        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [userInfo, setUserInfo]);

  const handleCancel = useCallback(() => {
    reset(); // Reset form to original values
    setIsEditing(false);
  }, [reset]);
  console.log('userInfo:', userInfo);
  if (!userInfo) {
    return (
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
          <div className="flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { firstName, lastName, email, telephone, bio } = userInfo;
  const defaultBio = "No biography provided yet. Click edit to add your bio.";
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <FiUser className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{`${firstName} ${lastName}`}</h1>
                <p className="text-blue-100">User Profile</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-3 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                  <FiEdit3 size={20} />
                </button>) : (
                <>
                  <button
                    onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="p-3 rounded-xl bg-green-500/80 backdrop-blur-sm hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-white/30"
                  >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                          <FiSave size={20} />
                      )}
                  </button>
                  <button
                    onClick={handleCancel}
                      disabled={isSubmitting}
                      className="p-3 rounded-xl bg-red-500/80 backdrop-blur-sm hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 border border-white/30"
                  >
                    <FiX size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>        {/* Profile Content */}
        {!isEditing ? (
          // Display Mode
          <div className="p-6 space-y-6">
            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <FiMail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Email Address</p>
                    <p className="text-blue-900 font-semibold">{email || 'No email provided'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500 rounded-xl">
                    <FiPhone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Phone Number</p>
                    <p className="text-green-900 font-semibold">{telephone || 'No phone provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <MdOutlineBiotech className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-purple-900">Biography</h3>
              </div>
              <p className="text-purple-800 leading-relaxed">{bio || defaultBio}</p>
            </div>

            {/* Status Badge */}
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 text-center hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-center gap-3">
                <BsPersonVcard className="h-6 w-6 text-emerald-500" />
                <span className="text-emerald-700 font-bold text-lg">Verified User</span>
              </div>
            </div>
          </div>) : (
          // Edit Mode
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Information - Edit Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email - Read Only */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-400 rounded-xl">
                      <FiMail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Email Address (Read Only)</p>
                      <p className="text-gray-800 font-semibold">{email || 'No email provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Phone - Editable */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500 rounded-xl">
                      <FiPhone className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-green-600 font-medium mb-2">Phone Number</p>
                      <input
                        {...register("telephone", { required: "Phone number is required" })}
                        defaultValue={telephone}
                        className="w-full px-3 py-2 rounded-lg border border-green-300 focus:border-green-500 focus:outline-none bg-white shadow-sm"
                        placeholder="Enter phone number"
                      />
                      {errors.telephone && (
                        <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section - Edit Mode */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-500 rounded-xl">
                    <MdOutlineBiotech className="h-5 w-5 text-white" />
                  </div>
                    <h3 className="text-lg font-bold text-purple-900">Biography</h3>
                  </div>
                  <textarea
                    {...register("bio")}
                    defaultValue={bio}
                    className="w-full px-4 py-3 rounded-lg border border-purple-300 focus:border-purple-500 focus:outline-none resize-none bg-white shadow-sm"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                  >
                    Cancel Changes
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
        )}
      </div>
    </div>
  )
}
