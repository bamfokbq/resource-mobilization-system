import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserbyEmailAndHashPassword } from "@/actions/users"
import { Credentials as CustomCredentials } from './types/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as CustomCredentials        
        
        const user = await getUserbyEmailAndHashPassword(email, password)
        
        if (user) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          }
        } else { 
          throw new Error("Invalid credentials")
        }
      },
    }),
  ]
})