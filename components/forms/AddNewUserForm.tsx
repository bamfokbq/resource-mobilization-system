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

export function AddNewUserForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur'
  })

  const regionValue = watch('region');
  const organisationValue = watch('organisation');
  const roleValue = watch('role');

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    const loadingToast = toast.loading('Creating user account...', {
      icon: <Loader2 className="animate-spin" />,
      description: 'Please wait while we set up the account'
    });

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = await createNewUser(formData)

      if (!result.success) {
        toast.dismiss(loadingToast)
        toast.error(result.error || 'Failed to create user', {
          icon: <XCircle className="text-red-500 h-5 w-5" />,
          description: 'Please try again'
        })
        return
      }

      toast.dismiss(loadingToast)
      toast.success(`Account successfully created for ${data.firstName} ${data.lastName}`, {
        icon: <CheckCircle2 className="text-green-500 h-5 w-5" />,
        description: 'Form cleared for next entry'
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto p-4 space-y-4 border border-[hsl(var(--ligher-gray))] rounded-lg sm:p-6"
    >
      <div className="text-sm text-gray-500 mb-4">
        All fields are required unless specified as optional
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="firstName" className="sm:text-right text-[hsl(var(--dark-gray))]">
            First Name
          </Label>
          <div className="sm:col-span-3">
            <Input
              {...register("firstName")}
              id="firstName"
              placeholder="Enter first name"
              className={`border-2 bg-white ${errors.firstName
                ? "border-[hsl(var(--nobe-red))] focus:border-[hsl(var(--nobe-red))]"
                : "border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))]"
                } shadow-none`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="lastName" className="sm:text-right text-[hsl(var(--dark-gray))]">
            Last Name
          </Label>
          <div className="sm:col-span-3">
            <Input
              {...register("lastName")}
              id="lastName"
              placeholder="Enter last name"
              className={`border-2 bg-white ${errors.lastName
                ? "border-[hsl(var(--nobe-red))] focus:border-[hsl(var(--nobe-red))]"
                : "border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))]"
                } shadow-none`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="email" className="sm:text-right text-[hsl(var(--dark-gray))]">
            Email
          </Label>
          <div className="sm:col-span-3">
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Enter email address"
              className={`border-2 bg-white ${errors.email
                ? "border-[hsl(var(--nobe-red))] focus:border-[hsl(var(--nobe-red))]"
                : "border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))]"
                } shadow-none`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="telephone" className="sm:text-right text-[hsl(var(--dark-gray))]">
            Telephone
          </Label>
          <div className="sm:col-span-3">
            <Input
              {...register("telephone")}
              id="telephone"
              type="tel"
              placeholder="Enter phone number"
              className={`border-2 bg-white ${errors.telephone
                ? "border-[hsl(var(--nobe-red))] focus:border-[hsl(var(--nobe-red))]"
                : "border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))]"
                } shadow-none`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="role" className="sm:text-right text-[hsl(var(--dark-gray))]">
            Role
          </Label>
          <div className="sm:col-span-3">
            <Select
              {...register("role")}
              onValueChange={(value) => setValue("role", value as "User" | "Admin")}
              defaultValue="User"
            >
              <SelectTrigger
                className={`border-2 bg-white ${errors.role
                  ? "border-[hsl(var(--nobe-red))] focus:border-[hsl(var(--nobe-red))]"
                  : "border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))]"
                  } shadow-none`}
              >
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {roleValue !== "Admin" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="region" className="sm:text-right text-[hsl(var(--dark-gray))]">
                Region
              </Label>
              <div className="sm:col-span-3">
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
                  <SelectTrigger className={`border-2 bg-white ${errors.region
                    ? "border-[hsl(var(--nobe-red))] focus:border-[hsl(var(--nobe-red))]"
                    : "border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))]"
                    } shadow-none`}>
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
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
              <Label htmlFor="organisation" className="sm:text-right text-[hsl(var(--dark-gray))]">
                Organisation
              </Label>
              <div className="sm:col-span-3">
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
                  <SelectTrigger className={`border-2 bg-white ${errors.organisation
                    ? "border-[hsl(var(--nobe-red))] focus:border-[hsl(var(--nobe-red))]"
                    : "border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))]"
                    } shadow-none`}>
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
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end mt-6">
          <Button 
            type="submit" 
            className="w-full bg-[hsl(var(--navy-blue))] hover:bg-[hsl(var(--navy-blue))]/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding User...
              </span>
            ) : (
              "Add User"
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}