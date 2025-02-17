"use client";

import { ADMIN_PROFILE } from '@/constant';
import type { AdminProfile } from '@/types';
import { useState } from 'react';
import { BsPersonVcard } from 'react-icons/bs';
import { FiEdit3, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import { MdOutlineBiotech } from 'react-icons/md';
import AdminProfileForm from './AdminProfileForm';

export default function DisplayAdminProfile() {
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = (data: AdminProfile) => {
    console.log(data)
    setIsEditing(false)
    // Here you would typically update the data in your backend
  }

  const { firstName, lastName, email, telephone, bio } = ADMIN_PROFILE

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
                  <p className="text-light-blue">Administrator</p>
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
                    <p className="font-medium">{email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                  <FiPhone className="h-5 w-5 text-navy-blue" />
                  <div>
                    <p className="text-sm text-dark-gray">Phone</p>
                    <p className="font-medium">{telephone}</p>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="p-3 sm:p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MdOutlineBiotech className="h-5 w-5 text-navy-blue" />
                  <h3 className="font-semibold">Biography</h3>
                </div>
                <p className="text-dark-gray">{bio}</p>
              </div>
            </div>

            {/* Additional Info or Badge */}
            <div className="flex items-center justify-center p-3 sm:p-4 bg-mint-green/20 rounded-lg">
              <BsPersonVcard className="h-5 w-5 text-smit-green mr-2" />
              <span className="text-smit-green font-medium">Verified Administrator</span>
            </div>
          </div>
        ) : (
          <AdminProfileForm 
              defaultValues={{
                firstName: firstName || '',
                lastName: lastName || '',
                email: email || '',
                telephone: telephone || '',
                bio: bio || ''
              }}
              userId="admin"
              onCancel={() => setIsEditing(false)}
          />
        )}
      </div>
    </div>
  )
}
