
import { AdapterUser } from "next-auth/adapters"
export interface PrimaryButtonProps {
    href: string;
    text: string;
    bgColor?: string;
    textColor?: string;
}

export type AdminProfile = {
    firstName: string
    lastName: string
    email: string
    telephone: string
    bio: string
}

interface CustomAdapterUser extends AdapterUser {
    address?: string;
}


