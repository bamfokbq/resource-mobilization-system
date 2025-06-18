import { getDb } from '@/lib/db';

export async function getUserFromDb(email: string, passwordHash: string) {
    try {
        const database = await getDb();
        const users = database.collection('user');
        
        const user = await users.findOne({ 
            email: email,
            password: passwordHash 
        });
        
        return user;
    } catch (error) {
        console.error('Error fetching user from database:', error);
        return null;
    }
}
