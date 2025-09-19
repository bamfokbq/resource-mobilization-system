'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function UserLoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Real-time validation
  useEffect(() => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }, [email])

  useEffect(() => {
    if (password && password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
    } else {
      setPasswordError('')
    }
  }, [password])


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setIsValidating(true)

    // Clear previous errors
    setEmailError('')
    setPasswordError('')

    // Validate form
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
      setIsValidating(false)
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      setIsLoading(false)
      setIsValidating(false)
      return
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      setIsLoading(false)
      setIsValidating(false)
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
      
      // Add a small delay for better UX
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 500)
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
      setIsValidating(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <form
          className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-ghs-green/10 rounded-full mb-4"
            >
              <Lock className="w-8 h-8 text-ghs-green" />
            </motion.div>
            <h4 className="text-2xl md:text-3xl font-bold text-ghs-green">
              Welcome Back
            </h4>
            <p className="text-gray-600 text-sm">
              Sign in to access your dashboard
            </p>
          </div>

          <div className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`pl-10 h-12 border-2 bg-white transition-all duration-200 ${
                    emailError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-ghs-green focus:ring-ghs-green/20'
                  } rounded-lg shadow-sm`}
                  required
                />
                <AnimatePresence>
                  {email && !emailError && validateEmail(email) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {emailError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 h-12 border-2 bg-white transition-all duration-200 ${
                    passwordError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:border-ghs-green focus:ring-ghs-green/20'
                  } rounded-lg shadow-sm`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <AnimatePresence>
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {passwordError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>


            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || isValidating || !!emailError || !!passwordError}
              className="w-full h-12 bg-ghs-green hover:bg-ghs-green/90 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </motion.div>
                ) : isValidating ? (
                  <motion.div
                    key="validating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validating...
                  </motion.div>
                ) : (
                  <motion.span
                    key="signin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Need help? Contact your system administrator
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}