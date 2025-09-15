import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import PasswordChangeForm from '@/components/forms/PasswordChangeForm'

export default async function ChangePasswordPage() {
  const session = await auth()

  // Redirect to signin if not authenticated
  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Redirect to dashboard if not first login
  if (!session.user.firstLogin) {
    redirect('/dashboard')
  }

  return (
    <PasswordChangeForm userEmail={session.user.email || ''} />
  )
}
