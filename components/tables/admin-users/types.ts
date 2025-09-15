// Shared types for admin users table components
export interface User {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    region: string;
    telephone: string;
    organisation: string;
    role: string;
    isActive: boolean;
    createdAt: Date;
    bio: string;
    passwordResetAt?: Date;
    statusUpdatedAt?: Date;
    firstLogin: boolean;
    temporaryPassword?: string;
}

export interface DialogState<T = User | null> {
    open: boolean;
    user: T;
}

export interface UserActionsHandlers {
    onResetPassword: (user: User) => void;
    onToggleStatus: (user: User) => void;
    onViewDetails: (user: User) => void;
    onCopyEmail: (email: string) => void;
}

export interface UserTableStats {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    newThisMonth: number;
}
