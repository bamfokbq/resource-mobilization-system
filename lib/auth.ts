import { betterAuth } from 'better-auth';
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || '');
const db = client.db()

export const auth = betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET as string,
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            firstName: {
                type: 'string',
            },
            lastName: {
                type: 'string',
            },
            telephone: {
                type: 'string',
            },
            role: {
                type: 'string',
                default: 'user'
            },
            region: {
                type: 'string',
            },
            organisation: {
                type: 'string',
            }
        }
    },
});

type Session = typeof auth.$Infer.Session;
