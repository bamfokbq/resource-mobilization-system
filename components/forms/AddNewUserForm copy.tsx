'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { GHANA_REGIONS } from '@/constant'


const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  region: z.string().min(1, "Please select a region"),
  organisation: z.string().min(1, "Please select an organisation"),
})'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { GHANA_REGIONS } from '@/constant'
import { addNewUser } from "./actions"
import { useActionState } from "react"

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  region: z.string().min(1, "Please select a region"),
  organisation: z.string().min(1, "Please select an organisation"),
})

type FormValues = z.infer<typeof formSchema>

export function AddNewUserForm() {
  const [state, formAction] = useActionState(addNewUser, null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    try {
      const result = await addNewUser(formData)

      if (result?.success) {
        // Reset form on success
        reset()
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md mx-auto p-4 space-y-4 border border-[hsl(var(--ligher-gray))] rounded-lg sm:p-6"
    >
      <div className="space-y-3">
        {/* ... (previous input fields remain the same) ... */}

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            className="w-full bg-[hsl(var(--navy-blue))] hover:bg-[hsl(var(--navy-blue))]/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add User"}
          </Button>
        </div>

        {state?.success && (
          <div className="text-green-600 text-center">
            {state.message}
          </div>
        )}

        {state && !state.success && (
          <div className="text-red-600 text-center">
            {state.message}
          </div>
        )}
      </div>
    </form>
  )
}

type FormValues = z.infer<typeof formSchema>

export function AddNewUserForm() {
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      // Add your API call here
      console.log(data)
      // Show success message
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto p-4 space-y-4 border border-[hsl(var(--ligher-gray))] rounded-lg sm:p-6">
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="firstName" className="sm:text-right text-[hsl(var(--dark-gray))]">First Name</Label>
          <div className="sm:col-span-3">
            <Input
              {...register("firstName")}
              id="firstName"
              placeholder="Enter first name"
              className={`border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))] shadow-none ${
                errors.firstName ? "border-[hsl(var(--nobe-red))]" : ""
              }`}
            />
            {errors.firstName && (
              <p className="text-[hsl(var(--nobe-red))] text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="lastName" className="sm:text-right text-[hsl(var(--dark-gray))]">Last Name</Label>
          <div className="sm:col-span-3">
            <Input
              {...register("lastName")}
              id="lastName"
              placeholder="Enter last name"
              className={`border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))] shadow-none ${
                errors.lastName ? "border-[hsl(var(--nobe-red))]" : ""
              }`}
            />
            {errors.lastName && (
              <p className="text-[hsl(var(--nobe-red))] text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="email" className="sm:text-right text-[hsl(var(--dark-gray))]">Email</Label>
          <div className="sm:col-span-3">
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Enter email address"
              className={`border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))] shadow-none ${
                errors.email ? "border-[hsl(var(--nobe-red))]" : ""
              }`}
            />
            {errors.email && (
              <p className="text-[hsl(var(--nobe-red))] text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="password" className="sm:text-right text-[hsl(var(--dark-gray))]">Password</Label>
          <div className="sm:col-span-3">
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Enter password"
              className={`border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))] shadow-none ${
                errors.password ? "border-[hsl(var(--nobe-red))]" : ""
              }`}
            />
            {errors.password && (
              <p className="text-[hsl(var(--nobe-red))] text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="region" className="sm:text-right text-[hsl(var(--dark-gray))]">Region</Label>
          <div className="sm:col-span-3">
            <Select onValueChange={(value) => setValue("region", value)}>
              <SelectTrigger className={`border-[hsl(var(--ligher-gray))] shadow-none ${
                errors.region ? "border-[hsl(var(--nobe-red))]" : ""
              }`}>
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
              <p className="text-[hsl(var(--nobe-red))] text-sm mt-1">{errors.region.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
          <Label htmlFor="organisation" className="sm:text-right text-[hsl(var(--dark-gray))]">Organisation</Label>
          <div className="sm:col-span-3">
            <Select onValueChange={(value) => setValue("organisation", value)}>
                          <SelectTrigger className={`border-[hsl(var(--ligher-gray))] shadow-none ${
                errors.organisation ? "border-[hsl(var(--nobe-red))]" : ""
              }`}>
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
              <p className="text-[hsl(var(--nobe-red))] text-sm mt-1">{errors.organisation.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            type="submit" 
            className="w-full bg-[hsl(var(--navy-blue))] hover:bg-[hsl(var(--navy-blue))]/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add User"}
          </Button>
        </div>
      </div>
    </form>
  )
}