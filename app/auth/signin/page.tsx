import UserLoginForm from '@/components/forms/UserLoginForm'
import React from 'react'

export default function LoginPage() {
    return (
        <section className="flex flex-col md:flex-row mx-auto h-[100dvh] w-full overflow-hidden">
            {/* Left instructional section */}
            <div className="hidden md:block flex-1 relative bg-gradient-to-br from-navy-blue to-blue-900 p-4 md:p-8">
                <div className="flex items-center justify-center h-full relative z-10 py-4 md:py-8">
                    <div className="text-center max-w-lg px-4 md:px-0">
                        <h3 className="text-lg md:text-4xl text-mint-green font-bold mb-2 md:mb-6">
                            How to complete the survey
                        </h3>
                        <p className="text-white/90 text-sm md:text-lg mb-4 md:mb-10">
                            Follow the steps below for a seamless survey experience:
                        </p>
                        <ul className="space-y-2 md:space-y-4 text-white/85 text-sm md:text-lg">
                            <li className="flex items-center space-x-2 md:space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-mint-green/20 flex items-center justify-center text-mint-green font-semibold text-xs md:text-sm drop-shadow-sm">1</span>
                                <span>Sign in with your provided credentials.</span>
                            </li>
                            <li className="flex items-center space-x-2 md:space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-mint-green/20 flex items-center justify-center text-mint-green font-semibold text-xs md:text-sm drop-shadow-sm">2</span>
                                <span>Open the form, then disconnect to enter data offline.</span>
                            </li>
                            <li className="flex items-center space-x-2 md:space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-mint-green/20 flex items-center justify-center text-mint-green font-semibold text-xs md:text-sm drop-shadow-sm">3</span>
                                <span>Your data syncs automatically when online.</span>
                            </li>
                        </ul>
                    </div>
                </div>
                {/* Background decorative elements - hide on small screens */}
                <div className="hidden md:block absolute -bottom-32 -left-32 w-96 h-96 bg-mint-green/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="hidden md:block absolute top-20 -right-20 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl"></div>
                <div className="hidden md:block absolute top-1/2 left-1/4 w-40 h-40 bg-navy-blue/10 rounded-full blur-2xl animate-float"></div>
            </div>

            <UserLoginForm />
        </section>
    )
}
