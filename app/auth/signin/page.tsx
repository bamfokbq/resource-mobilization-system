import UserLoginForm from '@/components/forms/UserLoginForm'
import React from 'react'
import { Shield, Users, Database, Globe, CheckCircle } from 'lucide-react'

export default function LoginPage() {
    return (
        <section className="flex flex-col md:flex-row mx-auto h-[100dvh] w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Left instructional section */}
            <div className="hidden md:block flex-1 relative bg-gradient-to-br from-ghs-green via-ghs-green/95 to-ghs-green/90 p-4 md:p-8 overflow-hidden">
                <div className="flex items-center justify-center h-full relative z-10 py-4 md:py-8">
                    <div className="text-center max-w-lg px-4 md:px-0">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-mint-green/20 rounded-full mb-4 animate-pulse">
                                <Shield className="w-8 h-8 text-mint-green" />
                            </div>
                            <h3 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-mint-green to-white bg-clip-text text-transparent">
                                Resource Mobilization System
                            </h3>
                            <p className="text-white/90 text-sm md:text-lg mb-8 leading-relaxed">
                                Streamline your data collection and mapping process with our comprehensive platform
                            </p>
                        </div>
                        
                        <div className="space-y-6">
                            <h4 className="text-lg md:text-xl text-mint-green font-semibold mb-4">
                                Getting Started
                            </h4>
                            <ul className="space-y-4 text-white/85 text-sm md:text-base">
                                <li className="flex items-start space-x-3 group">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-mint-green/20 flex items-center justify-center text-mint-green font-semibold text-sm drop-shadow-sm group-hover:bg-mint-green/30 transition-colors duration-200">
                                        <CheckCircle className="w-4 h-4" />
                                    </span>
                                    <span className="pt-1">Sign in with your provided credentials to access the system</span>
                                </li>
                                <li className="flex items-start space-x-3 group">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-mint-green/20 flex items-center justify-center text-mint-green font-semibold text-sm drop-shadow-sm group-hover:bg-mint-green/30 transition-colors duration-200">
                                        <Database className="w-4 h-4" />
                                    </span>
                                    <span className="pt-1">Access forms and work offline - your data syncs automatically when online</span>
                                </li>
                                <li className="flex items-start space-x-3 group">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-mint-green/20 flex items-center justify-center text-mint-green font-semibold text-sm drop-shadow-sm group-hover:bg-mint-green/30 transition-colors duration-200">
                                        <Globe className="w-4 h-4" />
                                    </span>
                                    <span className="pt-1">Collaborate with your team and track progress in real-time</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                {/* Enhanced background decorative elements */}
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-mint-green/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-20 -right-20 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl animate-bounce"></div>
                <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-navy-blue/10 rounded-full blur-2xl animate-float"></div>
                <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl animate-ping"></div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
            </div>

            <UserLoginForm />
        </section>
    )
}
