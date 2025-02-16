import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from "better-auth/react"
import { auth } from './auth'

export const authClient = createAuthClient({
    plugins: [inferAdditionalFields<typeof auth>()],
    baseURL: "http://localhost:3000" // the base url of your auth server
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient