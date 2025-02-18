import { AdapterUser } from "next-auth/adapters"

interface PrimaryButtonProps {
    href: string;
    text: string;
    bgColor?: string;
    textColor?: string;
}

interface AdminProfile {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    bio: string;
}

interface CustomAdapterUser extends AdapterUser {
    firstName?: string;
    lastName?: string;
    email: string;
    telephone?: string;
    role?: "User" | "Admin";
    region?: string;
    organisation?: string;
    isActive?: boolean;
    bio?: string;
}

interface UserData extends Omit<CustomAdapterUser, 'id' | 'emailVerified'> {
    password: string;
    createdAt: Date;
}



export type { PrimaryButtonProps, AdminProfile, CustomAdapterUser, UserData }