"use client";
import { useUserStore } from '@/store/userStore';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { BsPersonVcard } from 'react-icons/bs';
import { FiEdit3, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import { MdOutlineBiotech } from 'react-icons/md';

interface FormInputs {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  bio: string;
}

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
  onSubmit: (data: any) => void;
}

export default function DisplayUserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const userInfo = useUserStore((state) => state.userInfo);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    console.log('Form submitted:', data);
    setIsEditing(false);
  };
  console.log('userInfo:', userInfo);

  if (!userInfo) {
    return (
      <div className="w-full px-4 sm:px-0">
        <div className="bg-card rounded-lg shadow-lg overflow-hidden p-6">
          <div className="flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-gray-300 rounded-full mb-4"></div>
              <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { firstName, lastName, email, telephone, bio } = userInfo;
  const defaultBio = "No biography provided yet. Click edit to add your bio.";

  return (
    <div className="w-full px-4 sm:px-0">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        {/* Header with Edit Button */}
        <div className="bg-navy-blue p-4 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-mint-green flex items-center justify-center">
                <FiUser className="h-8 w-8 sm:h-10 sm:w-10 text-navy-blue" />
              </div>
              {!isEditing ? (
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">{`${firstName} ${lastName}`}</h1>
                  <p className="text-light-blue">User</p>
                </div>
              ) : null}
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors self-end sm:self-auto"
            >
              <FiEdit3 size={20} />
            </button>
          </div>
        </div>

        {/* Profile Content */}
        {!isEditing ? (
          // Display Mode
          <div className="p-4 sm:p-6 space-y-4">
            <div className="space-y-4">
              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                  <FiMail className="h-5 w-5 text-navy-blue" />
                  <div>
                    <p className="text-sm text-dark-gray">Email</p>
                    <p className="font-medium">{email || 'No email provided'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                  <FiPhone className="h-5 w-5 text-navy-blue" />
                  <div>
                    <p className="text-sm text-dark-gray">Phone</p>
                    <p className="font-medium">{telephone || 'No phone provided'}</p>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MdOutlineBiotech className="h-5 w-5 text-navy-blue" />
                  <h3 className="font-semibold">Biography</h3>
                </div>
                <p className="text-dark-gray">{bio || defaultBio}</p>
              </div>
            </div>

            {/* Additional Info or Badge */}
            <div className="flex items-center justify-center p-3 sm:p-4 bg-mint-green/20 rounded-lg">
              <BsPersonVcard className="h-5 w-5 text-smit-green mr-2" />
              <span className="text-smit-green font-medium">Verified User</span>
            </div>
          </div>
        ) : (
            <div></div>
            // <AdminProfileForm
            //     defaultValues={{
            //       firstName: userInfo.firstName || '',
            //       lastName: userInfo.lastName || '',
            //       email: userInfo.email || '',
            //       telephone: userInfo.telephone || '',
            //       bio: userInfo.bio || ''
            //     }}
            //     userId={userInfo._id}
            //     onCancel={() => {
            //       console.log('Edit cancelled');
            //       setIsEditing(false);
            //     }}
            //     onSubmit={handleSubmit(onSubmit)}
            // />
        )}
      </div>
    </div>
  )
}
