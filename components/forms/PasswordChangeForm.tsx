'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { motion } from "motion/react";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validatePasswordStrength } from "@/lib/passwordGenerator"

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>

interface PasswordChangeFormProps {
  userEmail: string
  onSuccess?: () => void
}

export default function PasswordChangeForm({ userEmail, onSuccess }: PasswordChangeFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<{ isValid: boolean; errors: string[] }>({ isValid: false, errors: [] })
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  })

  const newPassword = watch("newPassword")

  // Check password strength as user types
  const handlePasswordChange = (password: string) => {
    if (password.length > 0) {
      const strength = validatePasswordStrength(password)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength({ isValid: false, errors: [] })
    }
  }

  const onSubmit = async (data: PasswordChangeFormData) => {
    setIsSubmitting(true)

    // Validate password strength
    const strength = validatePasswordStrength(data.newPassword)
    if (!strength.isValid) {
      setError("newPassword", { 
        message: strength.errors.join(", ") 
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to change password')
      }

      toast.success("Password changed successfully!", {
        icon: <CheckCircle2 className="text-green-500 h-5 w-5" />,
        description: "You will be redirected to the dashboard"
      })

      // Redirect to dashboard after successful password change
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 2000)

    } catch (error) {
      console.error('Password change error:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('Current password')) {
          setError("currentPassword", { message: error.message })
        } else {
          toast.error("Failed to change password", {
            icon: <AlertCircle className="text-red-500 h-5 w-5" />,
            description: error.message
          })
        }
      } else {
        toast.error("An unexpected error occurred", {
          icon: <AlertCircle className="text-red-500 h-5 w-5" />,
          description: "Please try again"
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8"
      >
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Change Your Password
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Welcome! Please set a new password for your account
              <br />
              <span className="font-medium text-blue-600">{userEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    {...register("currentPassword")}
                    className="pr-10"
                    placeholder="Enter your temporary password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-600">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    {...register("newPassword")}
                    className="pr-10"
                    placeholder="Enter your new password"
                    onChange={(e) => {
                      register("newPassword").onChange(e)
                      handlePasswordChange(e.target.value)
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-600">{errors.newPassword.message}</p>
                )}
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${passwordStrength.isValid ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={`text-xs ${passwordStrength.isValid ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordStrength.isValid ? 'Strong password' : 'Weak password'}
                      </span>
                    </div>
                    {passwordStrength.errors.length > 0 && (
                      <Alert className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          <ul className="list-disc list-inside space-y-1">
                            {passwordStrength.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="pr-10"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !passwordStrength.isValid}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
