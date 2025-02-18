import client from './db'

export async function getUserFromDb(email: string, hashedPassword: string) {
    try {
        await client.connect();
        const database = client.db("ncd_navigator");
        const users = database.collection("users");

        const user = await users.findOne({
            email: email,
            password: hashedPassword
        });

        return user;
    } catch (error) {
        console.error("Error finding user:", error);
        return null;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}