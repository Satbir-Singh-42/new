import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

export const connectDB = async () => {
  try {
    // Try to use in-memory MongoDB for development
    console.log("Starting in-memory MongoDB server...");
    mongod = await MongoMemoryServer.create({
      instance: {
        dbName: 'face2finance'
      }
    });
    const uri = mongod.getUri();
    
    await mongoose.connect(uri);
    console.log(`Connected to in-memory MongoDB successfully at ${uri}`);
    
    // Handle cleanup
    const cleanup = async () => {
      if (mongod) {
        console.log("Stopping MongoDB server...");
        await mongod.stop();
      }
      process.exit(0);
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Export the mongod instance for session store
export const getMongodUri = () => mongod ? mongod.getUri() : null;

export default mongoose;