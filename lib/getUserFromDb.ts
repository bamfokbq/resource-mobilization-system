import { getDb } from './db'

export async function getUserFromDb(email: string, hashedPassword: string) {
    try {
        const database = await getDb();
        const users = database.collection("users");

        const user = await users.findOne({
            email: email,
            password: hashedPassword
        });

        return user;
    } catch (error) {
        console.error("Error finding user:", error);
        return null;
    }
}