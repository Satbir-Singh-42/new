import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

export const connectDB = async () => {
  try {
    // Try to use in-memory MongoDB for development
    console.log("Starting in-memory MongoDB server...");
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    await mongoose.connect(uri);
    console.log("Connected to in-memory MongoDB successfully");
    
    // Handle cleanup
    process.on('SIGINT', async () => {
      if (mongod) {
        await mongod.stop();
      }
      process.exit(0);
    });
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default mongoose;