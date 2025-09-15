import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
    firstLogin?: boolean
  }

  interface Session extends DefaultSession {
    user?: {
      id: string
      role: string
      firstLogin?: boolean
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    firstLogin?: boolean
  }
}
