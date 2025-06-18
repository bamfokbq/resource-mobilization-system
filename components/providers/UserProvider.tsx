"use client";

import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';

interface UserProviderProps {
  user: {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    telephone?: string;
    bio?: string;
  } | null;
  children: React.ReactNode;
}

export default function UserProvider({ user, children }: UserProviderProps) {
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  useEffect(() => {
    if (user && user.name) {
      // Split the name into firstName and lastName
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setUserInfo({
        firstName,
        lastName,
        name: user.name,
        email: user.email || '',
        telephone: user.telephone || '',
        bio: user.bio || '',
        role: user.role,
        id: user.id,
        _id: user.id, // Using id as _id
      });
    } else {
      setUserInfo(null);
    }
  }, [user, setUserInfo]);

  return <>{children}</>;
}
