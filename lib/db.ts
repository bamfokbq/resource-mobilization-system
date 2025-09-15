// lib/mongodb.ts
import { MongoClient, ServerApiVersion, Db } from "mongodb"

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
}

// Only initialize MongoDB client in Node.js environment
let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

// Check if we're in a Node.js environment (not Edge Runtime)
const isNodeEnvironment = typeof window === 'undefined' && 
                          typeof process !== 'undefined' && 
                          process.versions?.node;

if (isNodeEnvironment) {
    if (process.env.NODE_ENV === "development") {
        let globalWithMongo = global as typeof globalThis & {
            _mongoClient?: MongoClient
            _mongoClientPromise?: Promise<MongoClient>
        }

        if (!globalWithMongo._mongoClientPromise) {
            client = new MongoClient(uri, options)
            globalWithMongo._mongoClientPromise = client.connect()
        }
        clientPromise = globalWithMongo._mongoClientPromise
    } else {
        client = new MongoClient(uri, options)
        clientPromise = client.connect()
    }
}

// Function to get connected database instance (only works in Node.js)
export async function getDb(): Promise<Db> {
    if (!clientPromise) {
        throw new Error("MongoDB is not available in Edge Runtime. Use API routes for database operations.")
    }
    const client = await clientPromise
    return client.db()
}

// Export a safe version of client promise
export function getMongoClient(): Promise<MongoClient> | null {
    return clientPromise
}

// Check if MongoDB is available
export const isMongoAvailable = () => !!clientPromise

export default clientPromise