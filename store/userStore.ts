import { create } from 'zustand';

interface UserInfo {
    firstName: string;
    lastName: string;
    name: string;
    email?: string;
    telephone?: string;
    bio?: string;
    role: string;
    id?: string;    // from session
    _id: string;    // from mongodb
}

interface UserStore {
    userInfo: UserInfo | null;
    setUserInfo: (user: UserInfo | null) => void;
    initialize: (user: UserInfo | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    userInfo: null,
    setUserInfo: (user) => set({ userInfo: user }),
    initialize: (user) => set({ userInfo: user }),
}));
