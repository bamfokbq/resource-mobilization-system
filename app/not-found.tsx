import React from 'react'
import Link from 'next/link'

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center p-8 rounded-lg bg-card shadow-lg max-w-md">
                <h1 className="text-6xl font-bold text-[hsl(var(--navy-blue))] mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-[hsl(var(--dark-gray))] mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-6">
                    Sorry, we couldn't find the resource you're looking for.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 rounded-md bg-[hsl(var(--navy-blue))] 
                             text-white hover:bg-[hsl(var(--light-blue))] 
                             hover:text-[hsl(var(--navy-blue))] transition-colors 
                             duration-300"
                >
                    Return Home
                </Link>
            </div>
        </div>
    )
}
