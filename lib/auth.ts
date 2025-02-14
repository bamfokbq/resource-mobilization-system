import { betterAuth } from 'better-auth';
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || '');
const db = client.db()

export const auth = betterAuth({
    database: mongodbAdapter(db),
    user: {
        additionalFields: {
            firstName: {
                type: 'string',
            },
            lastName: {
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
    emailAndPassword: {
       enabled: true
    }
});
