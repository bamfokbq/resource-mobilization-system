'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AlertCircle, CheckCircle2, Loader2, XCircle, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof formSchema>

export default function AdminLoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur'
  })

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    const loadingToast = toast.loading('Signing in...', {
      icon: <Loader2 className="animate-spin" />,
      description: 'Please wait while we verify your credentials',
      position: 'top-center'
    })

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      // Placeholder logic - in real app, replace with actual authentication
      if (data.email === 'admin@example.com' && data.password === 'admin123') {
        toast.dismiss(loadingToast)
        toast.success('Signed in successfully', {
          icon: <CheckCircle2 className="text-green-500 h-5 w-5" />,
          description: 'Welcome back!',
          position: 'top-center'
        })
        router.push('/admin/dashboard')
      } else {
        toast.dismiss(loadingToast)
        toast.error('Sign in failed', {
          icon: <XCircle className="text-red-500 h-5 w-5" />,
          description: 'Invalid email or password',
          position: 'top-center'
        })
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Something went wrong', {
        icon: <AlertCircle className="text-red-500 h-5 w-5" />,
        description: 'An unexpected error occurred. Please try again later.',
        position: 'top-center'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-ligher-gray p-4 md:p-0">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md mx-auto p-6 md:p-10 space-y-4 border border-ligher-gray rounded-lg"
      >
        <h4 className="text-2xl md:text-3xl font-bold text-[hsl(var(--navy-blue))] mb-6 md:mb-8 text-center">
          Admin Login
        </h4>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="email" className="text-[hsl(var(--dark-gray))]">
              Email
            </Label>
            <Input
              {...register('email')}
              id="email"
              type="email"
              placeholder="Enter email address"
              className={`border-2 bg-white ${errors.email
                ? "border-[hsl(var(--nobe-red))] focus:border-[hsl(var(--nobe-red))]"
                : "border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))]"
                } shadow-none bg-white`}
            />
            {errors.email && (
              <p className="text-[hsl(var(--nobe-red))] text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="password" className="text-[hsl(var(--dark-gray))]">
              Password
            </Label>
            <div className="relative">
              <Input
                {...register('password')}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`border bg-white pr-10 ${errors.password
                  ? "border-nobe-red focus:border-nobe-red"
                  : "border-ligher-gray focus:border-navy-blue"
                  } shadow-none bg-white`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[hsl(var(--nobe-red))] text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[hsl(var(--navy-blue))] hover:bg-[hsl(var(--navy-blue))]/90 text-white"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}