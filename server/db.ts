import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongod: MongoMemoryServer | null = null;

export async function connectDB() {
  try {
    if (process.env.NODE_ENV === 'development') {
      if (!mongod) {
        console.log('Starting in-memory MongoDB server...');
        mongod = await MongoMemoryServer.create();
      }
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('Connected to in-memory MongoDB successfully at', uri);
    } else {
      // Use real MongoDB in production
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/face2finance';
      await mongoose.connect(uri);
      console.log('Connected to MongoDB successfully');
    }
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}

export async function getMongodUri(): Promise<string> {
  if (mongod) {
    return mongod.getUri();
  }
  return process.env.MONGODB_URI || 'mongodb://localhost:27017/face2finance';
}

export async function closeDB() {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
      mongod = null;
    }
  } catch (error) {
    console.error('Error closing database:', error);
  }
}