import { AdapterUser } from "next-auth/adapters"

export interface PrimaryButtonProps {
    href: string;
    text: string;
    bgColor?: string;
    textColor?: string;
}

export interface AdminProfile {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    bio: string;
}

export interface CustomAdapterUser extends AdapterUser {
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

export interface UserData extends Omit<CustomAdapterUser, 'id' | 'emailVerified'> {
    password: string;
    createdAt: Date;
}


