'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

export default function UserLoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
      toast.error("Please fill in all fields", {
        position: "top-center",
        duration: 3000,
        style: {
          backgroundColor: '#FEE2E2',
          border: '1px solid #FCA5A5',
          color: '#991B1B',
        },
      })
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          toast.error("Invalid email or password", {
            position: "top-center",
            duration: 3000,
            style: {
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
            },
          })
        } else {
          toast.error("Authentication failed", {
            position: "top-center",
            duration: 3000,
            style: {
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
            },
          })
        }
        return
      }

      toast.success("Welcome back!", {
        position: "top-center",
        duration: 2000,
        style: {
          backgroundColor: '#ECFDF5',
          border: '1px solid #6EE7B7',
          color: '#065F46',
        },
      })
      router.push("/dashboard/surveys")
      router.refresh()
    } catch (error) {
      toast.error("Connection error. Please try again.", {
        position: "top-center",
        duration: 3000,
        style: {
          backgroundColor: '#FEF3F2',
          border: '1px solid #FDA29B',
          color: '#B42318',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-ligher-gray p-4 md:p-0">
      <form
        className="w-full max-w-md mx-auto p-6 md:p-10 space-y-4 border border-ligher-gray rounded-lg"
        onSubmit={handleSubmit}
      >
        <h4 className="text-2xl md:text-3xl font-bold text-[hsl(var(--navy-blue))] mb-6 md:mb-8 text-center">
          Welcome Back
        </h4>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="email" className="text-[hsl(var(--dark-gray))]">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter email address"
              className="border-2 bg-white border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))] shadow-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="password" className="text-[hsl(var(--dark-gray))]">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="border bg-white border-ligher-gray focus:border-navy-blue shadow-none pr-10"
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
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[hsl(var(--navy-blue))] hover:bg-[hsl(var(--navy-blue))]/90 text-white"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </form>
    </div>
  )
}