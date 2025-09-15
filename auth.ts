import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserbyEmailAndHashPassword } from "@/actions/users"
import { Credentials as CustomCredentials } from "./types/auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials as CustomCredentials

          // Fetch user including role from the database
          const user = await getUserbyEmailAndHashPassword(email, password)

          if (!user) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role, // ✅ Add role here
            firstLogin: user.firstLogin || false, // Add firstLogin flag
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role // ✅ Add role to JWT
        token.firstLogin = user.firstLogin // Add firstLogin to JWT
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string // ✅ Add role to session
        session.user.firstLogin = token.firstLogin as boolean // Add firstLogin to session
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/dashboard")) {
        return `${baseUrl}/dashboard`
      }
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      if (new URL(url).origin === baseUrl) {
        return url
      }
      return baseUrl
    },
  },
})
