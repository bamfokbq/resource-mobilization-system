'use client';

import { useSession } from '@/lib/auth-client';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';

export default function ClientProvider() {
    const { data } = useSession();
    const setUserInfo = useUserStore((state) => state.setUserInfo);

    useEffect(() => {
        if (data?.user) {
            // Transform the user data to ensure _id is set
            const transformedUser = {
                ...data.user,
                _id: data.user.id, // Set _id from session id
            };
            setUserInfo(transformedUser);
        }
    }, [data?.user, setUserInfo]);

    return null;
}
