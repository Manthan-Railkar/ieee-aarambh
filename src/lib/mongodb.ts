import mongoose from "mongoose";

// Hardcoded MongoDB connection string (private repository)
const HARDCODED_MONGODB_URI =
  "mongodb+srv://sahabhimanyu782_db_user:EKCIoztFd0UHn1v3@cluster0.slm7a7a.mongodb.net/ieee_registration?retryWrites=true&w=majority&appName=Cluster0";

const MONGODB_URI = process.env.MONGODB_URI || HARDCODED_MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (!MONGODB_URI || MONGODB_URI.includes("PASTE_YOUR_")) {
    throw new Error(
      "MongoDB URI is not configured. Please set MONGODB_URI in src/lib/mongodb.ts."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export { HARDCODED_MONGODB_URI };
