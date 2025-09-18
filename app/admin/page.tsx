import React from 'react'
import AdminLoginForm from '@/components/forms/AdminLoginForm'
import Image from 'next/image'

export default function AdminPage() {
    return (
        <section className="flex flex-col md:flex-row mx-auto h-[100dvh] w-full overflow-hidden">
            <div className="hidden md:block flex-1 relative bg-gradient-to-br from-ghs-green to-ghs-green/90 p-4 md:p-8">
                <div className="flex items-center justify-center h-full relative z-10 py-4 md:py-8">
                    <Image src={'/admin_login_art.svg'} alt='Admin Login Icon' width={300} height={300} />
                </div>
                {/* Background decorative elements - hide on small screens */}
                <div className="hidden md:block absolute -bottom-32 -left-32 w-96 h-96 bg-mint-green/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="hidden md:block absolute top-20 -right-20 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl"></div>
                <div className="hidden md:block absolute top-1/2 left-1/4 w-40 h-40 bg-navy-blue/10 rounded-full blur-2xl animate-float"></div>
            </div>
            <AdminLoginForm />
        </section>
    )
}
