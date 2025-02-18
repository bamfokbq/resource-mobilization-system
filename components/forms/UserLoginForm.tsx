import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { signIn } from '@/auth'
import { redirect } from 'next/navigation'

export default function UserLoginForm() {
  return (
    <div className="flex-1 flex items-center justify-center bg-ligher-gray p-4 md:p-0">
      <form
        className="w-full max-w-md mx-auto p-6 md:p-10 space-y-4 border border-ligher-gray rounded-lg"
        action={async (formData: FormData) => {
          "use server"
          const result = await signIn("credentials", {
            redirect: false,
            email: formData.get("email"),
            password: formData.get("password"),
          })

          if (!result?.error) {
            return redirect("/dashboard")
          }
          return redirect("/auth/signIn");
        }}
      >
        <h4 className="text-2xl md:text-3xl font-bold text-[hsl(var(--navy-blue))] mb-6 md:mb-8 text-center">
          Welcome Back
        </h4>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="email" className="text-[hsl(var(--dark-gray))]">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter email address"
              className="border-2 bg-white border-[hsl(var(--ligher-gray))] focus:border-[hsl(var(--navy-blue))] shadow-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Label htmlFor="password" className="text-[hsl(var(--dark-gray))]">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="border bg-white border-ligher-gray focus:border-navy-blue shadow-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[hsl(var(--navy-blue))] hover:bg-[hsl(var(--navy-blue))]/90 text-white"
          >
            Sign In
          </Button>
        </div>
      </form>
    </div>
  )
}