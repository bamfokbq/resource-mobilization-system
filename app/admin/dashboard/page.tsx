import React from 'react'
import Link from 'next/link'

export default function AdminDashboardPage() {
    return (
        <section>
            <h1>Admin Dashboard Page</h1>
            <nav>
                <ul>
                    <li>
                        <Link href="/admin/dashboard/">Dashboard</Link>
                    </li>
                    <li>
                        <Link href="/admin/dashboard/user">User</Link>
                    </li>
                    <li>
                        <Link href="/admin/dashboard/profile">Profile</Link>
                    </li>
                </ul>
            </nav>
        </section>
    )
}
