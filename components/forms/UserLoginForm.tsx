import React from 'react'

export default function UserLoginForm() {

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-0">
      <div className="bg-white/80 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-xl w-full max-w-md mx-4 md:mx-0">
        <h4 className="text-2xl md:text-3xl font-bold text-navy-blue mb-6 md:mb-8 text-center">Welcome Back</h4>
        <form className="space-y-6" >
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-green focus:border-mint-green transition-all duration-200"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mint-green focus:border-mint-green transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="rounded text-mint-green focus:ring-mint-green mr-2" 
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-mint-green hover:text-navy-blue transition-colors">Forgot Password?</a>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-navy-blue to-blue-700 text-white py-3 rounded-lg font-medium
            hover:from-blue-700 hover:to-navy-blue transform hover:-translate-y-0.5 transition-all duration-200
            focus:ring-2 focus:ring-offset-2 focus:ring-navy-blue"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
