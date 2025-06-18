'use client'

import { useState } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { GHANA_REGIONS } from '@/constant'
import { AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { FiUser, FiMail } from 'react-icons/fi'
import { createNewUser } from "@/actions/users"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  telephone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["User", "Admin"]),
  region: z.string().optional(),
  organisation: z.string().optional(),
  password: z.string(),
})

type FormValues = z.infer<typeof formSchema>

interface AddNewUserFormProps {
  onSuccess?: () => void
}

export function AddNewUserForm({ onSuccess }: AddNewUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false)

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    watch,
    reset, } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
      mode: 'onBlur',
      defaultValues: {
        firstName: '',
        lastName: '',
        email: '',
        telephone: '',
        role: 'User',
        region: '',
        organisation: '',
        password: 'ncd@2025'
      }
  })

  const regionValue = watch('region'); const organisationValue = watch('organisation');
  const roleValue = watch('role');
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    const loadingToast = toast.loading('Creating user account...', {
      icon: <Loader2 className="animate-spin" />,
      description: 'Please wait while we set up the account'
    });

    try {
      const formData = new FormData()      // Set default password if not provided
      const formDataWithPassword = {
        ...data,
        password: data.password || 'ncd@2025'
      }

      Object.entries(formDataWithPassword).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = await createNewUser(formData)

      // Check for success status
      if (!result?.success) {
        toast.dismiss(loadingToast)
        toast.error(result?.error || 'Failed to create user', {
          icon: <XCircle className="text-red-500 h-5 w-5" />,
          description: 'Please try again'
        })
        return
      }

      toast.dismiss(loadingToast)

      // Show success overlay
      setShowSuccessOverlay(true)

      // Wait a moment then hide overlay and close modal
      setTimeout(() => {
        setShowSuccessOverlay(false)
        toast.success(`Account successfully created for ${data.firstName} ${data.lastName}`, {
          icon: <CheckCircle2 className="text-green-500 h-5 w-5" />,
          description: 'User can now access the system'
        })

        // Reset form
        reset({
          firstName: '',
          lastName: '',
          email: '',
          telephone: '',
          region: '',
          organisation: '',
          role: 'User',
          password: 'ncd@2025'
        })

        // Call onSuccess callback to close modal
        onSuccess?.()
      }, 2000)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Something went wrong', {
        icon: <AlertCircle className="text-red-500 h-5 w-5" />,
        description: 'An unexpected error occurred. Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors)
    toast.error('Please fix the form errors before submitting', {
      icon: <XCircle className="text-red-500 h-5 w-5" />,
      description: 'Check all required fields are filled correctly'
    })
  }

  return (
    <div className="w-full space-y-6 relative">
      {/* Loading Overlay During Submission */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-200 flex items-center gap-4">
            <div className="relative">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <div className="absolute inset-0 animate-ping">
                <Loader2 className="h-8 w-8 text-blue-300 opacity-30" />
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">Creating User Account</p>
              <p className="text-sm text-gray-600">Please wait while we set up the account...</p>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <AlertCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Account Setup Information</p>
            <p className="text-xs text-blue-600">All fields marked with * are required. Default password will be set to "ncd@2025"</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* Personal Information Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <FiUser className="h-4 w-4" />
            </div>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("firstName")}
                id="firstName"
                placeholder="Enter first name"
                className={`
                  border-2 transition-all duration-200 rounded-lg
                  ${errors.firstName
                    ? "border-red-300 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                  }
                  focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                `}
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="h-4 w-4" />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("lastName")}
                id="lastName"
                placeholder="Enter last name"
                className={`
                  border-2 transition-all duration-200 rounded-lg
                  ${errors.lastName
                    ? "border-red-300 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                  }
                  focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                `}
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="h-4 w-4" />
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white">
              <FiMail className="h-4 w-4" />
            </div>
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="Enter email address"
                className={`
                  border-2 transition-all duration-200 rounded-lg
                  ${errors.email
                    ? "border-red-300 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                  }
                  focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                `}
              />
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="h-4 w-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Telephone */}
            <div className="space-y-2">
              <Label htmlFor="telephone" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("telephone")}
                id="telephone"
                type="tel"
                placeholder="Enter phone number"
                className={`
                  border-2 transition-all duration-200 rounded-lg
                  ${errors.telephone
                    ? "border-red-300 focus:border-red-500 bg-red-50"
                    : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                  }
                  focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                `}
              />
              {errors.telephone && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="h-4 w-4" />
                  {errors.telephone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Configuration Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            Account Configuration
          </h3>

          <div className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                User Role <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("role", value as "User" | "Admin")}
                defaultValue="User"
              >
                <SelectTrigger className={`
                  border-2 transition-all duration-200 rounded-lg
                  ${errors.role
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                  }
                  focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                `}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="h-4 w-4" />
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Conditional Fields for User Role */}
            {roleValue !== "Admin" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border">
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm font-medium text-gray-700">
                    Region
                  </Label>
                  <Select
                    value={regionValue}
                    onValueChange={(value) => {
                      setValue('region', value, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                  >
                    <SelectTrigger className={`
                      border-2 transition-all duration-200 rounded-lg
                      ${errors.region
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                      }
                      focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                    `}>
                      <SelectValue placeholder="Select a region" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(GHANA_REGIONS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.region && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      {errors.region.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organisation" className="text-sm font-medium text-gray-700">
                    Organisation
                  </Label>
                  <Select
                    value={organisationValue}
                    onValueChange={(value) => {
                      setValue('organisation', value, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                  >
                    <SelectTrigger className={`
                      border-2 transition-all duration-200 rounded-lg
                      ${errors.organisation
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                      }
                      focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                    `}>
                      <SelectValue placeholder="Select an organisation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vercel">Vercel</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="microsoft">Microsoft</SelectItem>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.organisation && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      {errors.organisation.message}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="
              px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
              hover:from-blue-700 hover:to-purple-700 
              text-white font-medium rounded-xl shadow-lg 
              hover:shadow-xl transition-all duration-300 
              transform hover:scale-105 disabled:opacity-50 
              disabled:cursor-not-allowed disabled:transform-none
              flex items-center gap-3
            "            disabled={isSubmitting || showSuccessOverlay}
          >
            {isSubmitting ? (
              <>
                <div className="relative">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <div className="absolute inset-0 animate-ping">
                    <Loader2 className="h-5 w-5 opacity-20" />
                  </div>
                </div>
                <span>Creating Account...</span>
              </>
            ) : showSuccessOverlay ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>Account Created!</span>
              </>
            ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Create User Account</span>
                  </>
            )}
          </Button>        </div>
      </form>

      {/* Success Overlay */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-green-200 max-w-md mx-4 transform animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              {/* Success Animation */}
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg">
                  <CheckCircle2 className="h-10 w-10 text-white animate-bounce" />
                </div>
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">User Created Successfully!</h3>
                <p className="text-gray-600">The new user account has been created and is ready to use.</p>
              </div>

              {/* Progress Dots */}
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}