import Link from 'next/link'
import React from 'react'

export default function AdminPage() {
    return (
        <div>
            <h1>Admin Login Page</h1>
            <Link href="/admin/dashboard">Login</Link>
        </div>
    )
}
