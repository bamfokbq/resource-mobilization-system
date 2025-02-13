'use client'

import { useActionState } from 'react'
import { adminLoginAction } from '@/actions/admin'

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLoginAction, {
    success: false,
    message: '',
    errors: {},
  })

  return (
    <div className="flex-1 flex items-center justify-center bg-ligher-gray p-4 md:p-0">
      <div className="p-6 md:p-10 w-full max-w-md mx-4 md:mx-0">
        <h4 className="text-2xl md:text-3xl font-bold text-navy-blue mb-6 md:mb-8 text-center">
          Admin Login
        </h4>
        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`w-full p-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all duration-200 ${state.errors?.email ? 'bg-white' : 'bg-white'}`}
              placeholder="email@example.com"
              aria-describedby="email-error"
            />
            {state.errors?.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {state.errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`w-full p-2 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all duration-200 ${state.errors?.password ? 'bg-white' : 'bg-white'}`}
              placeholder="••••••••"
              aria-describedby="password-error"
            />
            {state.errors?.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1">
                {state.errors.password}
              </p>
            )}
          </div>
          {/* <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                className="rounded text-mint-green focus:ring-mint-green mr-2"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a
              href="#"
              className="text-sm text-smit-green hover:text-smit-green/80 font-medium transition-colors"
            >
              Forgot Password?
            </a>
          </div> */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-navy-blue to-blue-700 text-white py-3 rounded-lg font-medium 
            hover:from-blue-700 hover:to-navy-blue transform hover:-translate-y-0.5 transition-all duration-200
            focus:ring-2 focus:ring-offset-2 focus:ring-navy-blue
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>

          {state.message && (
            <p className="text-red-500 text-center mt-4">{state.message}</p>
          )}
        </form>
      </div>
    </div>
  )
}